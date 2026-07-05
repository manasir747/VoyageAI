from pydantic import BaseModel, Field
from typing import List, Optional


class TripPlanRequest(BaseModel):
    destination: str
    startDate: str
    endDate: str
    travellers: str
    budget: str
    style: str
    interests: List[str]
    notes: str = ""


class DayActivity(BaseModel):
    title: str
    description: str
    meta: Optional[str] = None


class DayPlan(BaseModel):
    title: str
    date: str
    activities: List[DayActivity]


class HotelRecommendation(BaseModel):
    name: str
    location: str
    meta: Optional[str] = None
    bestMatch: bool = False


class FlightRecommendation(BaseModel):
    airline: str
    route: str
    meta: Optional[str] = None
    price: str


class BudgetSummary(BaseModel):
    total: str
    trend: str
    travelTime: str
    activitiesCount: int


class TripPlanResponse(BaseModel):
    destination: str
    overview: str
    budgetSummary: BudgetSummary
    hotels: List[HotelRecommendation]
    flights: List[FlightRecommendation]
    days: List[DayPlan]
    travelTips: str
    packingSuggestions: List[str]
