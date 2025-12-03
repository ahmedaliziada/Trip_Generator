from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from datetime import datetime, date

from database import get_db, engine, Base
from models import Itinerary
from schemas import ItineraryCreate, ItineraryResponse, ItineraryUpdate, GenerateItineraryRequest
from gemini_service import GeminiService

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Travel Itinerary Generator API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini service
gemini_service = GeminiService()

@app.get("/")
async def root():
    return {"message": "Travel Itinerary Generator API v1.0"}

@app.post("/api/itinerary/generate")
async def generate_itinerary(request: GenerateItineraryRequest, db: Session = Depends(get_db)):
    """Generate a new itinerary using Gemini AI"""
    try:
        # Generate itinerary using Gemini
        itinerary_data = await gemini_service.generate_itinerary(
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            interests=request.interests
        )
        
        # Save to database
        db_itinerary = Itinerary(
            destination=request.destination,
            start_date=request.start_date,
            end_date=request.end_date,
            interests=request.interests,
            itinerary_data=itinerary_data,
            created_at=datetime.utcnow()
        )
        db.add(db_itinerary)
        db.commit()
        db.refresh(db_itinerary)
        
        return ItineraryResponse.from_orm(db_itinerary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@app.get("/api/itinerary", response_model=List[ItineraryResponse])
async def get_itineraries(db: Session = Depends(get_db)):
    """Retrieve all saved itineraries"""
    itineraries = db.query(Itinerary).order_by(Itinerary.created_at.desc()).all()
    return itineraries

@app.get("/api/itinerary/{itinerary_id}", response_model=ItineraryResponse)
async def get_itinerary(itinerary_id: int, db: Session = Depends(get_db)):
    """Get a specific itinerary by ID"""
    itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary

@app.post("/api/itinerary", response_model=ItineraryResponse)
async def save_itinerary(itinerary: ItineraryCreate, db: Session = Depends(get_db)):
    """Save a new itinerary"""
    db_itinerary = Itinerary(**itinerary.dict(), created_at=datetime.utcnow())
    db.add(db_itinerary)
    db.commit()
    db.refresh(db_itinerary)
    return db_itinerary

@app.patch("/api/itinerary/{itinerary_id}", response_model=ItineraryResponse)
async def update_itinerary(
    itinerary_id: int, 
    updates: ItineraryUpdate, 
    db: Session = Depends(get_db)
):
    """Modify a saved itinerary"""
    itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    update_data = updates.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(itinerary, field, value)
    
    db.commit()
    db.refresh(itinerary)
    return itinerary

@app.delete("/api/itinerary/{itinerary_id}")
async def delete_itinerary(itinerary_id: int, db: Session = Depends(get_db)):
    """Delete a saved itinerary"""
    itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    db.delete(itinerary)
    db.commit()
    return {"message": "Itinerary deleted successfully"}

@app.post("/api/itinerary/{itinerary_id}/adjust")
async def adjust_itinerary(
    itinerary_id: int, 
    request: dict,
    db: Session = Depends(get_db)
):
    """Use Gemini to adjust/summarize trip plans"""
    itinerary = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    
    try:
        adjustment = request.get("adjustment", "")
        adjusted_data = await gemini_service.adjust_itinerary(
            itinerary.itinerary_data, 
            adjustment
        )
        
        itinerary.itinerary_data = adjusted_data
        db.commit()
        db.refresh(itinerary)
        
        return ItineraryResponse.from_orm(itinerary)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to adjust itinerary: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)