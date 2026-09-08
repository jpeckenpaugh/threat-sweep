from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal, initialize_database
from .seed import seed, utcnow
from .models import Mission, MissionAttempt, PlayerProfile
from .schemas import SettingsRequest, AttemptStart, ActionRequest
from .services.missions import cards, unlocked
from .services import attempts

@asynccontextmanager
async def lifespan(app):
    initialize_database(); db=SessionLocal(); seed(db); db.close(); yield

app=FastAPI(title='Threat Sweep API', lifespan=lifespan)
def db_session():
    db=SessionLocal()
    try: yield db
    finally: db.close()
def error(status, code, message): raise HTTPException(status_code=status, detail={'code':code,'message':message})
def mission_or_404(db, mission_id):
    mission=db.get(Mission,mission_id)
    if not mission: error(404,'mission_not_found','Mission was not found.')
    return mission
def attempt_or_404(db, attempt_id):
    attempt=db.get(MissionAttempt,attempt_id)
    if not attempt: error(404,'attempt_not_found','Attempt was not found.')
    return attempt

@app.get('/api/health')
def health(): return {'status':'ok'}
@app.get('/api/bootstrap')
def bootstrap(db:Session=Depends(db_session)):
    player=db.get(PlayerProfile,1); return {'player':{'soundEnabled':player.sound_enabled,'updatedAt':player.updated_at.isoformat()+'Z'},'missions':cards(db)}
@app.put('/api/player/settings')
def settings(payload:SettingsRequest, db:Session=Depends(db_session)):
    player=db.get(PlayerProfile,1); player.sound_enabled=payload.soundEnabled; player.updated_at=utcnow(); db.commit(); return {'soundEnabled':player.sound_enabled,'updatedAt':player.updated_at.isoformat()+'Z'}
@app.post('/api/missions/{mission_id}/attempts', status_code=201)
def create_attempt(mission_id:int,payload:AttemptStart|None=None,db:Session=Depends(db_session)):
    mission=mission_or_404(db,mission_id)
    if not unlocked(db,mission): error(403,'mission_locked','Complete the preceding mission first.')
    attempt,_=attempts.start(db,mission,payload.restart if payload else False); return attempts.snapshot(attempt)
@app.get('/api/attempts/{attempt_id}')
def get_attempt(attempt_id:str,db:Session=Depends(db_session)): return attempts.snapshot(attempt_or_404(db,attempt_id))
@app.post('/api/attempts/{attempt_id}/actions')
def action(attempt_id:str,payload:ActionRequest,db:Session=Depends(db_session)):
    attempt=attempt_or_404(db,attempt_id); mission=mission_or_404(db,attempt.mission_id)
    try: return attempts.act(db,attempt,mission,payload.type,payload.row,payload.column)
    except IndexError as exc: error(400,'invalid_coordinates',str(exc))
    except ValueError as exc: error(409,'invalid_action',str(exc))
    except RuntimeError as exc: error(409,'attempt_complete',str(exc))
@app.post('/api/attempts/{attempt_id}/abandon')
def abandon(attempt_id:str,db:Session=Depends(db_session)): return attempts.abandon(db,attempt_or_404(db,attempt_id))
