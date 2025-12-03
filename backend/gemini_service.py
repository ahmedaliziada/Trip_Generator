import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from datetime import date, datetime

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def generate_itinerary(
        self, 
        destination: str, 
        start_date: date, 
        end_date: date, 
        interests: List[str]
    ) -> Dict[str, Any]:
        """Generate a travel itinerary using Gemini AI"""
        
        # Calculate number of days
        days = (end_date - start_date).days + 1
        
        prompt = f"""
        Create a detailed travel itinerary for {destination} from {start_date} to {end_date} ({days} days).
        
        User interests: {', '.join(interests)}
        
        Please provide a JSON response with the following structure:
        {{
            "itinerary": [
                {{
                    "day": 1,
                    "date": "{start_date}",
                    "activities": [
                        "Morning: Activity description with location",
                        "Afternoon: Activity description with location", 
                        "Evening: Activity description with location"
                    ],
                    "meals": {{
                        "breakfast": "Restaurant/cafe recommendation",
                        "lunch": "Restaurant/cafe recommendation",
                        "dinner": "Restaurant/cafe recommendation"
                    }},
                    "accommodation": "Hotel/area recommendation",
                    "notes": "Any important tips or notes for the day"
                }}
            ],
            "total_estimated_cost": "Estimated budget range",
            "best_time_to_visit": "Season/weather information",
            "transportation": "How to get around the city",
            "cultural_tips": "Important cultural information"
        }}
        
        Focus on the user's interests: {', '.join(interests)}.
        Include specific recommendations for places, restaurants, and activities.
        Make sure the itinerary is realistic and accounts for travel time between locations.
        """
        
        try:
            response = self.model.generate_content(prompt)
            
            # Extract JSON from response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            # Parse JSON
            itinerary_data = json.loads(response_text.strip())
            
            return itinerary_data
            
        except json.JSONDecodeError as e:
            # Fallback: create a simple itinerary structure
            return self._create_fallback_itinerary(destination, start_date, end_date, interests, days)
        except Exception as e:
            raise Exception(f"Failed to generate itinerary: {str(e)}")
    
    async def adjust_itinerary(self, current_itinerary: Dict[str, Any], adjustment: str) -> Dict[str, Any]:
        """Adjust an existing itinerary based on user request"""
        
        prompt = f"""
        Here is the current travel itinerary:
        {json.dumps(current_itinerary, indent=2)}
        
        User wants to adjust it with this request: "{adjustment}"
        
        Please modify the itinerary according to the user's request and return the updated JSON.
        Keep the same structure but make SIGNIFICANT and VISIBLE changes based on the request.
        
        For "budget-friendly" requests, please:
        - Replace ALL expensive restaurants with specific budget-friendly alternatives (local street food, affordable cafes, markets)
        - Change premium activities to FREE or low-cost alternatives (free museums, public parks, walking tours)
        - Update accommodation suggestions to budget options (hostels, budget hotels, specific neighborhoods)
        - Add specific money-saving tips in the notes
        - Update transportation to cheapest options (public transport, walking, bike rentals)
        - Include specific price ranges where possible
        
        For other adjustments:
        - Cultural: Add museums, cultural centers, local festivals, art galleries
        - Food: Focus on specific local cuisine, food markets, cooking classes, restaurant tours
        - Relaxed: Reduce number of activities, add spa time, leisurely meals, rest periods
        - Outdoor: Add hiking, parks, outdoor sports, nature activities
        
        Make sure the changes are OBVIOUS and SUBSTANTIAL - don't just make minor tweaks.
        Return the complete updated itinerary in the same JSON format.
        """
        
        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            adjusted_data = json.loads(response_text.strip())
            return adjusted_data
            
        except json.JSONDecodeError:
            # If parsing fails, return original itinerary
            return current_itinerary
        except Exception as e:
            raise Exception(f"Failed to adjust itinerary: {str(e)}")
    
    def _create_fallback_itinerary(
        self, 
        destination: str, 
        start_date: date, 
        end_date: date, 
        interests: List[str], 
        days: int
    ) -> Dict[str, Any]:
        """Create a basic fallback itinerary if AI generation fails"""
        
        itinerary = []
        current_date = start_date
        
        for day in range(1, days + 1):
            day_data = {
                "day": day,
                "date": current_date.isoformat(),
                "activities": [
                    f"Morning: Explore {destination} city center",
                    f"Afternoon: Visit local attractions related to {interests[0] if interests else 'sightseeing'}",
                    f"Evening: Dinner and local entertainment"
                ],
                "meals": {
                    "breakfast": "Local cafe or hotel breakfast",
                    "lunch": "Traditional local restaurant",
                    "dinner": "Recommended restaurant in city center"
                },
                "accommodation": f"Hotel in {destination} city center",
                "notes": f"Day {day} of your {destination} adventure"
            }
            itinerary.append(day_data)
            current_date = date.fromordinal(current_date.toordinal() + 1)
        
        return {
            "itinerary": itinerary,
            "total_estimated_cost": "Budget varies based on preferences",
            "best_time_to_visit": "Check local weather and seasons",
            "transportation": "Public transport and walking recommended",
            "cultural_tips": "Research local customs and etiquette"
        }