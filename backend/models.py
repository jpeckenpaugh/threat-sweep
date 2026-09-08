from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class PlayerProfile(Base):
    __tablename__ = "player_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sound_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)


class Mission(Base):
    __tablename__ = "missions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    briefing: Mapped[str] = mapped_column(Text, nullable=False)
    grid_rows: Mapped[int] = mapped_column(Integer, nullable=False)
    grid_columns: Mapped[int] = mapped_column(Integer, nullable=False)
    threat_config_json: Mapped[str] = mapped_column(Text, nullable=False)
    target_score: Mapped[int] = mapped_column(Integer, nullable=False)


class MissionProgress(Base):
    __tablename__ = "mission_progress"
    __table_args__ = (UniqueConstraint("profile_id", "mission_id"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("player_profiles.id"), nullable=False)
    mission_id: Mapped[int] = mapped_column(ForeignKey("missions.id"), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    best_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    best_rating: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class MissionAttempt(Base):
    __tablename__ = "mission_attempts"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("player_profiles.id"), nullable=False, index=True)
    mission_id: Mapped[int] = mapped_column(ForeignKey("missions.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String, nullable=False)
    board_seed: Mapped[int] = mapped_column(Integer, nullable=False)
    board_state_json: Mapped[str] = mapped_column(Text, nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    clear_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    scan_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    mark_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)


class AttemptEvent(Base):
    __tablename__ = "attempt_events"
    __table_args__ = (UniqueConstraint("attempt_id", "sequence"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    attempt_id: Mapped[str] = mapped_column(ForeignKey("mission_attempts.id"), nullable=False, index=True)
    sequence: Mapped[int] = mapped_column(Integer, nullable=False)
    event_type: Mapped[str] = mapped_column(String, nullable=False)
    payload_json: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
