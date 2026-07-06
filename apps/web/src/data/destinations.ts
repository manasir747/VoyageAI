export interface Destination {
  id: string;
  city: string;
  country: string;
  continent: string;
  rating: number;
  bestSeason: string;
  startingBudget: number;
  category: string[]; // Can belong to multiple categories
  image: string;
  description: string;
}

export const CATEGORIES = [
  { id: "beach", label: "Beach", emoji: "🏖" },
  { id: "mountains", label: "Mountains", emoji: "🏔" },
  { id: "cities", label: "Cities", emoji: "🏙" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "adventure", label: "Adventure", emoji: "🎒" },
  { id: "luxury", label: "Luxury", emoji: "💎" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "solo", label: "Solo", emoji: "🚶" },
];

export const DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    city: "Bali",
    country: "Indonesia",
    continent: "Asia",
    rating: 4.8,
    bestSeason: "April - October",
    startingBudget: 800,
    category: ["beach", "nature", "solo"],
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    description:
      "A tropical paradise known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
  },
  {
    id: "dest-2",
    city: "Kyoto",
    country: "Japan",
    continent: "Asia",
    rating: 4.9,
    bestSeason: "March - May",
    startingBudget: 1500,
    category: ["cities", "nature", "solo"],
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    description:
      "Famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
  },
  {
    id: "dest-3",
    city: "Santorini",
    country: "Greece",
    continent: "Europe",
    rating: 4.7,
    bestSeason: "May - September",
    startingBudget: 1800,
    category: ["beach", "luxury", "cities"],
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop",
    description:
      "Recognizable by its whitewashed, cubiform houses with blue accents, clinging to cliffs above an underwater caldera.",
  },
  {
    id: "dest-4",
    city: "Swiss Alps",
    country: "Switzerland",
    continent: "Europe",
    rating: 4.9,
    bestSeason: "December - March",
    startingBudget: 2500,
    category: ["mountains", "luxury", "adventure"],
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop",
    description:
      "Breathtaking mountain range offering world-class skiing, hiking, and stunning panoramic alpine views.",
  },
  {
    id: "dest-5",
    city: "Maui",
    country: "United States",
    continent: "North America",
    rating: 4.8,
    bestSeason: "April - May, September - November",
    startingBudget: 2200,
    category: ["beach", "family", "nature"],
    image:
      "https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=800&auto=format&fit=crop",
    description:
      "Known for its world-famous beaches, the sacred Iao Valley, views of migrating humpback whales and sunset spectaculars.",
  },
  {
    id: "dest-6",
    city: "Machu Picchu",
    country: "Peru",
    continent: "South America",
    rating: 4.9,
    bestSeason: "May - October",
    startingBudget: 1200,
    category: ["mountains", "adventure", "nature"],
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop",
    description:
      "An Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley.",
  },
  {
    id: "dest-7",
    city: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    rating: 4.6,
    bestSeason: "November - March",
    startingBudget: 2000,
    category: ["cities", "luxury", "family"],
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    description:
      "A city and emirate known for luxury shopping, ultramodern architecture and a lively nightlife scene.",
  },
  {
    id: "dest-8",
    city: "Banff",
    country: "Canada",
    continent: "North America",
    rating: 4.8,
    bestSeason: "June - August",
    startingBudget: 1600,
    category: ["mountains", "nature", "adventure"],
    image:
      "https://images.unsplash.com/photo-1544372995-1f95886985d8?q=80&w=800&auto=format&fit=crop",
    description:
      "A resort town and one of Canada's most popular tourist destinations, known for its mountainous surroundings and hot springs.",
  },
  {
    id: "dest-9",
    city: "Rome",
    country: "Italy",
    continent: "Europe",
    rating: 4.8,
    bestSeason: "April - June, September - October",
    startingBudget: 1400,
    category: ["cities", "family", "solo"],
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
    description:
      "Capital of Italy, known for its nearly 3,000 years of globally influential art, architecture and culture.",
  },
  {
    id: "dest-10",
    city: "Bora Bora",
    country: "French Polynesia",
    continent: "Oceania",
    rating: 4.9,
    bestSeason: "May - October",
    startingBudget: 4500,
    category: ["beach", "luxury"],
    image:
      "https://images.unsplash.com/photo-1589394815804-964ce0ff9657?q=80&w=800&auto=format&fit=crop",
    description:
      "A small South Pacific island northwest of Tahiti in French Polynesia, surrounded by sand-fringed motus and a turquoise lagoon.",
  },
  {
    id: "dest-11",
    city: "Queenstown",
    country: "New Zealand",
    continent: "Oceania",
    rating: 4.7,
    bestSeason: "December - February",
    startingBudget: 1800,
    category: ["mountains", "adventure"],
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8ebb4?q=80&w=800&auto=format&fit=crop",
    description:
      "Known as the adventure capital of the world, sitting on the shores of the South Island's Lake Wakatipu.",
  },
  {
    id: "dest-12",
    city: "Cape Town",
    country: "South Africa",
    continent: "Africa",
    rating: 4.7,
    bestSeason: "October - April",
    startingBudget: 1100,
    category: ["cities", "nature", "beach"],
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=800&auto=format&fit=crop",
    description:
      "A port city on South Africa's southwest coast, on a peninsula beneath the imposing Table Mountain.",
  },
  {
    id: "dest-13",
    city: "Reykjavik",
    country: "Iceland",
    continent: "Europe",
    rating: 4.6,
    bestSeason: "June - August",
    startingBudget: 2100,
    category: ["nature", "adventure"],
    image:
      "https://images.unsplash.com/photo-1533596664402-95b8ee9e551c?q=80&w=800&auto=format&fit=crop",
    description:
      "Iceland's coastal capital, known for its late-night clubs, museums, and proximity to geothermal spas and the Northern Lights.",
  },
  {
    id: "dest-14",
    city: "Phuket",
    country: "Thailand",
    continent: "Asia",
    rating: 4.5,
    bestSeason: "November - April",
    startingBudget: 700,
    category: ["beach", "solo", "luxury"],
    image:
      "https://images.unsplash.com/photo-1589394815804-964ce0ff9657?q=80&w=800&auto=format&fit=crop",
    description:
      "A rainforested, mountainous island in the Andaman Sea, with some of Thailand's most popular beaches.",
  },
  {
    id: "dest-15",
    city: "New York City",
    country: "United States",
    continent: "North America",
    rating: 4.8,
    bestSeason: "April - June, September - November",
    startingBudget: 2000,
    category: ["cities", "solo", "luxury"],
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop",
    description:
      "A global hub of art, fashion, food and theater, where neon lights meet soaring skyscrapers.",
  },
  {
    id: "dest-16",
    city: "Paris",
    country: "France",
    continent: "Europe",
    rating: 4.8,
    bestSeason: "April - June, October - November",
    startingBudget: 1600,
    category: ["cities", "luxury", "solo"],
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
    description:
      "France's capital, a major European city and a global center for art, fashion, gastronomy and culture.",
  },
  {
    id: "dest-17",
    city: "Tulum",
    country: "Mexico",
    continent: "North America",
    rating: 4.6,
    bestSeason: "November - December",
    startingBudget: 1200,
    category: ["beach", "nature"],
    image:
      "https://images.unsplash.com/photo-1505881402582-c5bc11054f91?q=80&w=800&auto=format&fit=crop",
    description:
      "Known for its well-preserved ruins of an ancient Mayan port city and its stunning coastline.",
  },
  {
    id: "dest-18",
    city: "Amalfi Coast",
    country: "Italy",
    continent: "Europe",
    rating: 4.9,
    bestSeason: "May - September",
    startingBudget: 2400,
    category: ["beach", "luxury", "cities"],
    image:
      "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=800&auto=format&fit=crop",
    description:
      "A 50-kilometer stretch of coastline along the southern edge of Italy's Sorrentine Peninsula.",
  },
  {
    id: "dest-19",
    city: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    rating: 4.5,
    bestSeason: "March - May, September - November",
    startingBudget: 900,
    category: ["cities", "adventure"],
    image:
      "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop",
    description: "A former imperial city in western Morocco, home to mosques, palaces and gardens.",
  },
  {
    id: "dest-20",
    city: "Maldives",
    country: "Maldives",
    continent: "Asia",
    rating: 4.9,
    bestSeason: "November - April",
    startingBudget: 3500,
    category: ["beach", "luxury"],
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800&auto=format&fit=crop",
    description:
      "A tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, known for beaches, blue lagoons and extensive reefs.",
  },
];

export const RECOMMENDATION_MAP: Record<string, string[]> = {
  Japan: ["Seoul", "Taipei", "Singapore", "Bali"],
  Italy: ["Paris", "Santorini", "Swiss Alps", "Amalfi Coast"],
  "United States": ["Banff", "Maui", "Tulum", "New York City"],
  France: ["Rome", "Swiss Alps", "Santorini", "Marrakech"],
  Indonesia: ["Phuket", "Maldives", "Bora Bora", "Kyoto"],
  // Default fallback handled in logic
};
