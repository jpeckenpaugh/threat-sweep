import json
from ..models import Mission, MissionProgress


def unlocked(session, mission):
    return mission.order_index == 1 or session.query(MissionProgress).join(Mission).filter(MissionProgress.profile_id == 1, Mission.order_index == mission.order_index - 1, MissionProgress.completed_at.isnot(None)).first() is not None


def cards(session):
    output = []
    for mission in session.query(Mission).order_by(Mission.order_index):
        progress = session.query(MissionProgress).filter_by(profile_id=1, mission_id=mission.id).one_or_none()
        locked = not unlocked(session, mission)
        data = {"id": mission.id, "slug": mission.slug, "title": mission.title, "briefing": mission.briefing, "grid": {"rows": mission.grid_rows, "columns": mission.grid_columns}, "threatCategories": list(json.loads(mission.threat_config_json)), "targetScore": mission.target_score, "locked": locked, "completed": bool(progress and progress.completed_at), "bestScore": progress.best_score if progress else 0, "bestRating": progress.best_rating if progress else 0}
        output.append(data)
    return output
