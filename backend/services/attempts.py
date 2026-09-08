import json, random, uuid
from datetime import datetime
from sqlalchemy import func
from ..models import AttemptEvent, MissionAttempt, MissionProgress
from ..seed import utcnow
from .game_engine import make_board, public_board, resolve, safe_complete

def snapshot(attempt, terminal=False):
    board=json.loads(attempt.board_state_json)
    return {'id':attempt.id,'missionId':attempt.mission_id,'status':attempt.status,'score':attempt.score,'clearCount':attempt.clear_count,'scanCount':attempt.scan_count,'markCount':attempt.mark_count,'startedAt':attempt.started_at.isoformat()+'Z','finishedAt':attempt.finished_at.isoformat()+'Z' if attempt.finished_at else None,'board':public_board(board, terminal or attempt.status != 'active')}

def event(session, attempt, event_type, payload):
    sequence=(session.query(func.max(AttemptEvent.sequence)).filter_by(attempt_id=attempt.id).scalar() or 0)+1
    session.add(AttemptEvent(attempt_id=attempt.id,sequence=sequence,event_type=event_type,payload_json=json.dumps(payload),created_at=utcnow()))

def start(session, mission, restart=False):
    current=session.query(MissionAttempt).filter_by(profile_id=1,mission_id=mission.id,status='active').one_or_none()
    if current and not restart: return current, False
    if current: current.status='abandoned'; current.finished_at=utcnow(); event(session,current,'abandon',{})
    seed=random.SystemRandom().randint(1,2**31-1); config=json.loads(mission.threat_config_json)
    attempt=MissionAttempt(id=str(uuid.uuid4()),profile_id=1,mission_id=mission.id,status='active',board_seed=seed,board_state_json=json.dumps(make_board(mission.grid_rows,mission.grid_columns,config,seed)),score=0,clear_count=0,scan_count=0,mark_count=0,started_at=utcnow())
    session.add(attempt); event(session,attempt,'start',{'missionId':mission.id}); session.commit(); return attempt, True

def act(session, attempt, mission, action, row, column):
    if attempt.status!='active': raise RuntimeError('Attempt is no longer active.')
    board=json.loads(attempt.board_state_json)
    if row >= board['rows'] or column >= board['columns']: raise IndexError('Coordinates are outside this mission grid.')
    effects,events,failed,clears,scans,breach=resolve(board,action,row,column,attempt.board_seed + attempt.scan_count + attempt.clear_count)
    attempt.clear_count += clears; attempt.scan_count += scans
    if action=='mark': attempt.mark_count += 1 if board['cells'][row][column]['state']=='marked' else -1
    attempt.score += clears*10 - (2 if scans else 0)
    result=None
    if failed:
        attempt.status='failed'; attempt.finished_at=utcnow(); events.append('failure'); result=finish(session,attempt,mission,False)
    elif safe_complete(board):
        attempt.status='succeeded'; attempt.finished_at=utcnow(); attempt.score += max(0,20-attempt.scan_count)*2 + max(0,attempt.mark_count); events.append('success'); result=finish(session,attempt,mission,True)
    attempt.board_state_json=json.dumps(board)
    event(session,attempt,action,{'row':row,'column':column,'effects':effects})
    for effect in effects: event(session,attempt,'effect',effect)
    session.commit()
    return {'attempt':snapshot(attempt, bool(result)),'action':{'type':action,'row':row,'column':column},'effects':effects,'events':events,'result':result}

def finish(session, attempt, mission, succeeded):
    rating=0
    if succeeded:
        rating=3 if attempt.score>=mission.target_score else 2 if attempt.score>=mission.target_score*.65 else 1
        progress=session.query(MissionProgress).filter_by(profile_id=1,mission_id=mission.id).one_or_none()
        new_best=not progress or attempt.score>(progress.best_score if progress else 0)
        if not progress: progress=MissionProgress(profile_id=1,mission_id=mission.id,completed_at=utcnow(),best_score=attempt.score,best_rating=rating); session.add(progress)
        else:
            progress.completed_at=progress.completed_at or utcnow(); progress.best_score=max(progress.best_score,attempt.score); progress.best_rating=max(progress.best_rating,rating)
        unlocked=mission.id+1 if mission.order_index < 5 else None
    else: new_best=False; unlocked=None
    return {'outcome':'success' if succeeded else 'failure','score':attempt.score,'rating':rating,'newBest':new_best,'unlockedMissionId':unlocked}

def abandon(session, attempt):
    if attempt.status=='active': attempt.status='abandoned'; attempt.finished_at=utcnow(); event(session,attempt,'abandon',{}); session.commit()
    return snapshot(attempt)
