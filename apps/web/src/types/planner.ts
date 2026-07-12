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
  address: string;
  imageQuery: string;
  bookingQuery: string;
  summary: string;
  price: string;
  tag: string;
  image_url?: string;
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

export interface RestaurantRecommendation {
  name: string;
  cuisine: string;
  rating: string;
  price: string;
  description: string;
  address: string;
}

export interface TripPlanResponse {
  destination: string;
  latitude: number;
  longitude: number;
  overview: string;
  budgetSummary: BudgetSummary;
  hotels: HotelRecommendation[];
  restaurants: RestaurantRecommendation[];
  flights: FlightRecommendation[];
  days: DayPlan[];
  travelTips: string;
  packingSuggestions: string[];
}
