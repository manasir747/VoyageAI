export interface TripPlanRequest {
  departureCity: string;
  destination: string;
  startDate: string;
  endDate: string;
  travellers: string;
  budget: string;
  style: string;
  interests: string[];
  notes?: string;
}

export interface DayActivity {
  title: string;
  description: string;
  meta?: string;
}

export interface DayPlan {
  title: string;
  date: string;
  activities: DayActivity[];
}

export interface HotelRecommendation {
  name: string;
  location: string;
  meta?: string;
  bestMatch?: boolean;
}

export interface FlightRecommendation {
  type: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: string;
  cabinClass: string;
}

export interface BudgetSummary {
  total: string;
  trend: string;
  travelTime: string;
  activitiesCount: number;
}

export interface TripPlanResponse {
  destination: string;
  overview: string;
  budgetSummary: BudgetSummary;
  hotels: HotelRecommendation[];
  flights: FlightRecommendation[];
  days: DayPlan[];
  travelTips: string;
  packingSuggestions: string[];
}
