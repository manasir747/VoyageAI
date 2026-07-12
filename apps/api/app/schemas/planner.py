from pydantic import BaseModel, Field
from typing import List, Optional


class TripPlanRequest(BaseModel):
    departureCity: str
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
    address: str
    imageQuery: str
    bookingQuery: str
    summary: str
    price: str
    tag: str
    image_url: Optional[str] = None
    meta: Optional[str] = None
    bestMatch: bool = False


class FlightRecommendation(BaseModel):
    type: str
    airline: str
    departureAirport: str
    arrivalAirport: str
    departureDate: str
    departureTime: str
    arrivalDate: str
    arrivalTime: str
    duration: str
    stops: str
    price: str
    cabinClass: str


class BudgetSummary(BaseModel):
    total: str
    trend: str
    travelTime: str
    activitiesCount: int


class RestaurantRecommendation(BaseModel):
    name: str
    cuisine: str
    rating: str
    price: str
    description: str
    address: str


class TripPlanResponse(BaseModel):
    destination: str
    latitude: float
    longitude: float
    overview: str
    budgetSummary: BudgetSummary
    hotels: List[HotelRecommendation]
    restaurants: List[RestaurantRecommendation]
    flights: List[FlightRecommendation]
    days: List[DayPlan]
    travelTips: str
    packingSuggestions: List[str]
