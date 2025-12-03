from sqlalchemy import Column, Integer, String, Date, DateTime, JSON
from datetime import datetime
from database import Base

class Itinerary(Base):
    __tablename__ = "itineraries"
    
    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, index=True, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    interests = Column(JSON, nullable=False)  # List of interests
    itinerary_data = Column(JSON, nullable=False)  # Generated itinerary
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)