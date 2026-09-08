from pydantic import BaseModel, Field
from typing import Literal

class SettingsRequest(BaseModel): soundEnabled: bool
class AttemptStart(BaseModel): restart: bool = False
class ActionRequest(BaseModel):
    type: Literal["scan", "clear", "mark"]
    row: int = Field(ge=0)
    column: int = Field(ge=0)
