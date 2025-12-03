from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import date, datetime

class GenerateItineraryRequest(BaseModel):
    destination: str
    start_date: date
    end_date: date
    interests: List[str]

class ItineraryCreate(BaseModel):
    destination: str
    start_date: date
    end_date: date
    interests: List[str]
    itinerary_data: Any

class ItineraryUpdate(BaseModel):
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    interests: Optional[List[str]] = None
    itinerary_data: Optional[Any] = None

class ItineraryResponse(BaseModel):
    id: int
    destination: str
    start_date: date
    end_date: date
    interests: List[str]
    itinerary_data: Any
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True