import json
from datetime import datetime, timezone
from .models import Mission, PlayerProfile

MISSIONS = [
    (1, "signal-breach", "Signal Breach", "Trace viral activity in the exposed relay.", 6, 6, {"virus": 3, "software_bug": 3}, 260),
    (2, "ghost-terminal", "Ghost Terminal", "A hostile terminal is probing the subnet.", 7, 7, {"virus": 3, "hacker": 3, "software_bug": 3}, 350),
    (3, "botnet-drift", "Botnet Drift", "Contain drifting autonomous nodes.", 7, 8, {"virus": 3, "hacker": 3, "rogue_ai_bot": 3}, 400),
    (4, "malware-cascade", "Malware Cascade", "Stop a cascading infection before it spreads.", 8, 8, {"virus": 3, "rogue_ai_bot": 3, "malware": 3}, 470),
    (5, "blackout-protocol", "Blackout Protocol", "Sweep the dark core against every known threat.", 8, 9, {"virus": 3, "hacker": 3, "software_bug": 3, "rogue_ai_bot": 3, "malware": 3}, 560),
]


def utcnow(): return datetime.now(timezone.utc).replace(tzinfo=None)


def seed(session):
    if not session.get(PlayerProfile, 1):
        now = utcnow(); session.add(PlayerProfile(id=1, sound_enabled=True, created_at=now, updated_at=now))
    for values in MISSIONS:
        order, slug, title, briefing, rows, columns, config, target = values
        record = session.query(Mission).filter_by(slug=slug).one_or_none()
        if not record:
            session.add(Mission(id=order, slug=slug, order_index=order, title=title, briefing=briefing, grid_rows=rows, grid_columns=columns, threat_config_json=json.dumps(config), target_score=target))
    session.commit()
