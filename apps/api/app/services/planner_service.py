import json
from typing import Protocol
from fastapi import HTTPException
from pydantic import ValidationError
from google import genai
from google.genai import types

from app.core.config import settings
from app.schemas.planner import (
    TripPlanRequest,
    TripPlanResponse,
    BudgetSummary,
    HotelRecommendation,
    FlightRecommendation,
    DayPlan,
    DayActivity,
)


class TripPlannerService(Protocol):
    async def generate(self, request: TripPlanRequest) -> TripPlanResponse: ...


class MockPlannerService:
    async def generate(self, request: TripPlanRequest) -> TripPlanResponse:
        # We simulate the rich itinerary based on the UI design from Phase 5A
        return TripPlanResponse(
            destination=request.destination,
            overview="A perfect blend of traditional culture, modern neon lights, and incredible cuisine, optimized for a moderate budget and adventurous spirit.",
            budgetSummary=BudgetSummary(
                total="$1,850",
                trend="Within your budget goal",
                travelTime="12h 45m",
                activitiesCount=14,
            ),
            hotels=[
                HotelRecommendation(
                    name="Keio Plaza Hotel",
                    location="City Center",
                    meta="★ 4.5 • $180/night",
                    bestMatch=True,
                ),
                HotelRecommendation(
                    name="The Knot Boutique",
                    location="Downtown",
                    meta="★ 4.3 • $140/night",
                    bestMatch=False,
                ),
            ],
            flights=[
                FlightRecommendation(
                    airline="Global Airways",
                    route="Direct • 12h 45m",
                    meta="Recommended",
                    price="$850",
                )
            ],
            days=[
                DayPlan(
                    title="Welcome & Exploration",
                    date="Day 1",
                    activities=[
                        DayActivity(
                            title="Arrival & Check-in",
                            description="Transfer from airport and check into your recommended hotel.",
                            meta="14:00",
                        ),
                        DayActivity(
                            title="Local Park Walk",
                            description="A peaceful start. Walk through the city's largest and most popular park.",
                            meta="16:00",
                        ),
                        DayActivity(
                            title="Dinner at Authentic Eatery",
                            description="Experience authentic local cuisine in the narrow, atmospheric alleys.",
                            meta="19:00",
                        ),
                    ],
                )
            ],
            travelTips="Purchase a local transit card immediately at the airport for seamless transit.",
            packingSuggestions=[
                "Comfortable walking shoes (expect 15k+ steps/day)",
                "Universal power adapter",
            ],
        )


class GeminiPlannerService:
    def __init__(self):
        if (
            not settings.gemini_api_key
            or settings.gemini_api_key == "your_gemini_api_key_here"
        ):
            raise HTTPException(
                status_code=500, detail="GEMINI_API_KEY is not configured properly."
            )
        self.client = genai.Client(api_key=settings.gemini_api_key)

    async def generate(self, request: TripPlanRequest) -> TripPlanResponse:
        system_instruction = (
            "You are an expert, premium AI travel planner. Your job is to create a complete, "
            "realistic, and highly appealing travel itinerary based on the user's preferences. "
            "You must output JSON that strictly matches the required schema. Ensure the response is rich in detail, "
            "uses engaging language, and includes realistic estimated prices where applicable."
        )

        prompt = (
            f"Destination: {request.destination}\n"
            f"Dates: {request.startDate} to {request.endDate}\n"
            f"Travellers: {request.travellers}\n"
            f"Budget: {request.budget}\n"
            f"Travel Style: {request.style}\n"
            f"Interests: {', '.join(request.interests) if request.interests else 'General'}\n"
            f"Additional Notes: {request.notes or 'None'}\n"
        )

        try:
            # We use the new google-genai SDK
            response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=TripPlanResponse.model_json_schema(),
                    temperature=0.7,
                ),
            )

            if not response.text:
                raise HTTPException(
                    status_code=500, detail="AI returned an empty response."
                )

            return TripPlanResponse.model_validate_json(response.text)

        except ValidationError as e:
            print("Validation error on AI response:", e)
            print("Raw response:", response.text if "response" in locals() else None)
            raise HTTPException(
                status_code=500,
                detail="The AI generated a malformed itinerary that could not be parsed.",
            )
        except Exception as e:
            print("Gemini API Error:", e)
            raise HTTPException(
                status_code=502,
                detail="Failed to communicate with the AI travel planner service. Please try again.",
            )


def get_planner_service() -> TripPlannerService:
    return GeminiPlannerService()
