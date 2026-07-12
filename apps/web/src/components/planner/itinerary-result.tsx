"use client";

import React, { useState, useEffect } from "react";
import { InteractiveCard, GlassCard } from "@/components/ui/card";
import { Reveal, Fade } from "@/components/motion/motion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/overlays";
import {
  Plane,
  Hotel,
  MapPin,
  Wallet,
  Sparkles,
  Navigation,
  Clock,
  Sun,
  Sunset,
  Moon,
  Star,
  Check,
  Calendar,
  Users,
  Utensils,
  Camera,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudSun,
  CloudRain,
  ThermometerSun,
  Download,
  Share2,
  BookmarkPlus,
  Info,
  AlertCircle,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripPlanRequest, TripPlanResponse } from "@/types/planner";
import { createClient } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { ItineraryPDF } from "./itinerary-pdf";
import { cn } from "@/lib/utils";

const truncateWords = (str: string, max: number) => {
  if (!str) return "";
  const words = str.split(" ");
  if (words.length <= max) return str;
  return words.slice(0, max).join(" ") + "...";
};

const ActivityCard = ({ act, isLast }: { act: any; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTimeIcon = (time?: string) => {
    if (!time) return <MapPin className="text-primary size-4" />;
    const hour = parseInt(time.split(":")[0] || "12");
    if (hour < 12) return <Sun className="text-warning size-4" />;
    if (hour < 17) return <Sun className="size-4 text-orange-400" />;
    if (hour < 20) return <Sunset className="text-destructive size-4" />;
    return <Moon className="size-4 text-indigo-400" />;
  };

  const wordCount = act.description ? act.description.split(" ").length : 0;
  const isLongText = wordCount > 30;

  return (
    <div className="relative flex gap-6 pb-8">
      {/* Timeline line */}
      {!isLast && <div className="bg-border/40 absolute bottom-0 left-6 top-10 w-[2px]" />}

      {/* Icon node */}
      <div className="relative z-10 flex shrink-0 flex-col items-center">
        <div className="bg-background border-border/50 flex size-12 items-center justify-center rounded-full border-2 shadow-sm">
          {getTimeIcon(act.meta)}
        </div>
      </div>

      {/* Content Card */}
      <InteractiveCard className="border-border/40 w-full p-5 shadow-sm">
        <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-1">
            {act.meta && (
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                {act.meta}
              </span>
            )}
            <h5 className="text-foreground text-lg font-bold leading-tight">{act.title}</h5>
          </div>
          <span className="bg-muted/50 text-foreground/70 shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
            Est. Cost: Varies
          </span>
        </div>

        <div className="text-muted-foreground text-sm leading-relaxed">
          <p className={!isExpanded && isLongText ? "line-clamp-2" : ""}>{act.description}</p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 mt-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </InteractiveCard>
    </div>
  );
};

import { HotelRecommendation } from "@/types/planner";

function HotelCard({ hotel, destination }: { hotel: HotelRecommendation; destination: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fallbackUrl =
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop";

    const fetchImage = async () => {
      try {
        const query1 = `${hotel.name} ${hotel.address || destination}`;
        const query2 = `luxury hotel ${destination}`;

        const fetchWiki = async (q: string) => {
          const res = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
              q,
            )}&gsrnamespace=0&gsrlimit=3&prop=pageimages&format=json&pithumbsize=800&origin=*`,
          );
          const data = await res.json();
          if (data.query?.pages) {
            const pages = Object.values(data.query.pages) as any[];
            // find first page with an image
            const pageWithImage = pages.find((p) => p.thumbnail?.source);
            if (pageWithImage) return pageWithImage.thumbnail.source;
          }
          return null;
        };

        // Priority 1: Exact hotel name + location
        let img = await fetchWiki(query1);

        // Priority 2: Destination luxury hotel
        if (!img) {
          img = await fetchWiki(query2);
        }

        if (isMounted) {
          setImageUrl(img || fallbackUrl);
        }
      } catch (err) {
        if (isMounted) setImageUrl(fallbackUrl);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [hotel, destination]);

  const bookingUrl = `https://www.google.com/travel/hotels?q=${encodeURIComponent(hotel.bookingQuery || hotel.name)}`;

  return (
    <InteractiveCard className="border-border/40 flex h-full flex-col overflow-hidden p-0">
      <div className="bg-muted relative h-48 w-full shrink-0">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={hotel.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {imageUrl ? (
              <Hotel className="text-muted-foreground size-10" />
            ) : (
              <Hotel className="text-muted-foreground size-10 animate-pulse" />
            )}
          </div>
        )}
        {hotel.bestMatch && (
          <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
            Top Pick
          </div>
        )}
        {hotel.tag && (
          <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
            {hotel.tag}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h4 className="mb-2 line-clamp-2 text-xl font-bold leading-tight">{hotel.name}</h4>
        <div className="text-muted-foreground mb-2 flex items-start gap-1.5 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <span className="line-clamp-2 flex-1 break-words">{hotel.address}</span>
        </div>
        {hotel.meta && (
          <p className="text-warning mb-2 flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Star className="size-3.5" /> {hotel.meta}
          </p>
        )}
        {hotel.summary && (
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{hotel.summary}</p>
        )}
        <div className="border-border/30 mt-auto flex items-center justify-between border-t pt-4">
          <span className="text-foreground shrink-0 text-sm font-bold">
            {hotel.price || "Price varies"}
          </span>
          <Button
            variant="default"
            size="sm"
            className="shrink-0 font-semibold shadow-sm transition-shadow hover:shadow-md"
            onClick={() => window.open(bookingUrl, "_blank", "noopener,noreferrer")}
          >
            View Details
          </Button>
        </div>
      </div>
    </InteractiveCard>
  );
}

export function ItineraryResult({
  data,
  request,
}: {
  data: TripPlanResponse;
  request: TripPlanRequest;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [weatherData, setWeatherData] = useState<
    { day: string; temp: string; icon: any; condition: string }[] | null
  >(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        if (!data.latitude || !data.longitude) return;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&daily=temperature_2m_max,weathercode&timezone=auto`,
        );
        const json = await res.json();

        if (json.daily && json.daily.time) {
          const w = json.daily.time.slice(0, 4).map((dateStr: string, idx: number) => {
            const temp = Math.round(json.daily.temperature_2m_max[idx]);
            const code = json.daily.weathercode[idx];
            let icon = Sun;
            let condition = "Sunny";

            if (code <= 1) {
              icon = Sun;
              condition = "Sunny";
            } else if (code <= 3) {
              icon = CloudSun;
              condition = "Partly Cloudy";
            } else if (code <= 49) {
              icon = Cloud;
              condition = "Cloudy";
            } else if (code <= 69) {
              icon = CloudRain;
              condition = "Rain";
            } else if (code <= 79) {
              icon = CloudSnow;
              condition = "Snow";
            } else {
              icon = CloudLightning;
              condition = "Storm";
            }

            return {
              day: `Day ${idx + 1}`,
              temp: `${temp}°C`,
              icon,
              condition,
            };
          });
          if (isMounted) setWeatherData(w);
        }
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
    };
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [data.latitude, data.longitude]);

  const handleSaveTrip = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save trips.");
        return;
      }

      const { error } = await supabase.from("saved_itineraries").insert({
        user_id: user.id,
        destination: request?.destination || data.destination,
        start_date: request?.startDate || null,
        end_date: request?.endDate || null,
        travellers: request?.travellers || "",
        travel_style: request?.style || "",
        interests: request?.interests || [],
        budget: request?.budget || data.budgetSummary.total,
        prompt: request?.notes || "",
        itinerary: data,
      });

      if (error) {
        if (error.code === "23505") toast.info("This trip is already saved.");
        else throw error;
      } else {
        toast.success("Trip saved successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save trip");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    const loadingToast = toast.loading("Generating PDF...");
    try {
      const blob = await pdf(<ItineraryPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VoyageAI-${data.destination.split(",")[0].replace(/ /g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF exported successfully", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: loadingToast });
    } finally {
      setIsExportingPDF(false);
    }
  };

  const totalCostMatch = data.budgetSummary.total.replace(/[^0-9]/g, "");
  const totalCost = totalCostMatch ? parseInt(totalCostMatch) : null;
  const perPerson = totalCost ? Math.round(totalCost / 2).toLocaleString() : null;

  const tipsList = data.travelTips
    ? data.travelTips.split(".").filter((t) => t.trim().length > 5)
    : [];

  return (
    <div className="relative flex min-h-full w-full flex-col items-center px-4 py-8">
      {/* Pre-modal compact preview */}
      <Reveal className="z-10 w-full max-w-xl">
        <div className="flex flex-col gap-6">
          <div className="border-border/40 bg-card rounded-2xl border p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="text-primary size-5" />
              <h2 className="font-display text-2xl font-bold">Your Itinerary is Ready</h2>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  Destination
                </span>
                <span className="font-semibold">{data.destination.split(",")[0]}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  Travel Dates
                </span>
                <span className="font-semibold">
                  {request?.startDate
                    ? new Date(request.startDate).toLocaleDateString()
                    : "Flexible"}{" "}
                  - {request?.endDate ? new Date(request.endDate).toLocaleDateString() : "Flexible"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  Budget
                </span>
                <span className="font-semibold">{data.budgetSummary.total}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  Travelers
                </span>
                <span className="font-semibold">{request?.travellers || "1"}</span>
              </div>
            </div>

            <div className="border-border/30 mb-6 flex flex-col gap-4 border-t pt-6">
              <div className="flex items-start gap-3">
                <Sun className="text-warning mt-0.5 size-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Weather Preview</span>
                  <span className="text-muted-foreground text-sm">Sunny • 72°F Average</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hotel className="text-primary mt-0.5 size-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Hotels Preview</span>
                  <span className="text-muted-foreground text-sm">
                    {data.hotels.length} recommended stays, including {data.hotels[0]?.name}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-accent mt-0.5 size-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Attractions Preview</span>
                  <span className="text-muted-foreground text-sm">
                    {data.budgetSummary.activitiesCount} activities planned
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-success mt-0.5 size-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Day-wise Itinerary</span>
                  <span className="text-muted-foreground text-sm">
                    {data.days.length} days perfectly scheduled
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Utensils className="text-destructive mt-0.5 size-4 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Restaurants Preview</span>
                  <span className="text-muted-foreground text-sm">
                    Hand-picked local dining options
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveTrip}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1 font-bold"
                >
                  {isSaving ? "Saving..." : "Save Trip"}
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  variant="outline"
                  className="flex-1 font-bold"
                >
                  {isExportingPDF ? "Exporting..." : "Export PDF"}
                </Button>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="shadow-glow w-full font-bold">View Full Itinerary</Button>
                </DialogTrigger>

                {/* FULL MODAL */}
                <DialogContent className="bg-background flex h-[95vh] w-[95vw] max-w-6xl flex-col overflow-hidden p-0 sm:rounded-[2rem]">
                  <div className="custom-scrollbar flex-1 overflow-y-auto">
                    {/* 1. HERO SECTION */}
                    <div className="relative w-full pb-[40%] pt-[25%] sm:pb-[30%] sm:pt-[15%]">
                      <div className="absolute inset-0">
                        <img
                          src={`https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop`}
                          alt={data.destination}
                          className="h-full w-full object-cover"
                        />
                        <div className="from-background via-background/80 absolute inset-0 bg-gradient-to-t to-black/30" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
                        <div className="mx-auto max-w-5xl">
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className="bg-primary/20 text-primary border-primary/30 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                              <Star className="size-3.5 fill-current" /> Premium Itinerary
                            </span>
                            {request?.style && (
                              <span className="bg-background/20 text-foreground border-border/30 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                {request.style} Style
                              </span>
                            )}
                          </div>

                          <h1 className="font-display mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl">
                            {data.destination}
                          </h1>

                          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/90 sm:text-base">
                            {request?.startDate && request?.endDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="size-5 opacity-70" />
                                <span>
                                  {new Date(request.startDate).toLocaleDateString()} -{" "}
                                  {new Date(request.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="size-5 opacity-70" />
                              <span>{data.budgetSummary.travelTime}</span>
                            </div>
                            {request?.travellers && (
                              <div className="flex items-center gap-2">
                                <Users className="size-5 opacity-70" />
                                <span>{request.travellers} Travelers</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mx-auto flex w-full max-w-5xl flex-col space-y-20 px-6 py-12 sm:px-12">
                      {/* ACTIONS TOOLBAR */}
                      <div className="border-border/30 bg-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 shadow-sm">
                        <div className="flex items-center gap-6 px-2">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                              Est. Budget
                            </span>
                            <span className="text-foreground text-xl font-bold">
                              {data.budgetSummary.total}
                            </span>
                          </div>
                          <div className="bg-border/50 h-8 w-px" />
                          <div className="flex flex-col">
                            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                              Activities
                            </span>
                            <span className="text-foreground text-xl font-bold">
                              {data.budgetSummary.activitiesCount}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-3">
                          <Button
                            variant="outline"
                            onClick={handleSaveTrip}
                            disabled={isSaving}
                            className="rounded-xl font-semibold"
                          >
                            <BookmarkPlus className="mr-2 size-4" />{" "}
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => toast.info("Sharing coming soon!")}
                            className="rounded-xl font-semibold"
                          >
                            <Share2 className="mr-2 size-4" /> Share
                          </Button>
                          <Button
                            onClick={handleExportPDF}
                            disabled={isExportingPDF}
                            className="shadow-glow rounded-xl font-semibold"
                          >
                            <Download className="mr-2 size-4" />{" "}
                            {isExportingPDF ? "Exporting..." : "Export"}
                          </Button>
                        </div>
                      </div>

                      {/* OVERVIEW */}
                      <div className="space-y-6">
                        <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                          <Compass className="text-primary size-8" /> Trip Overview
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {data.overview}
                        </p>
                      </div>

                      {/* FLIGHTS */}
                      {data.flights.length > 0 && (
                        <div className="space-y-8">
                          <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                            <Plane className="text-primary size-8" /> Recommended Flights
                          </h3>
                          <div className="grid grid-cols-1 gap-6">
                            {data.flights.map((flight, idx: number) => {
                              const kayakUrl = `https://www.kayak.com/flights/${flight.departureAirport}-${flight.arrivalAirport}/${request?.startDate || ""}${request?.endDate ? `/${request.endDate}` : ""}?sort=bestflight_a`;
                              return (
                                <InteractiveCard
                                  key={idx}
                                  className="border-border/40 flex flex-col gap-6 p-6"
                                >
                                  {flight.type && (
                                    <div className="text-muted-foreground border-border/40 border-b pb-3 text-sm font-bold uppercase tracking-widest">
                                      {flight.type}
                                    </div>
                                  )}
                                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-col gap-1">
                                      <h4 className="text-xl font-bold">{flight.airline}</h4>
                                      <span className="text-muted-foreground text-sm font-medium">
                                        {flight.cabinClass}
                                      </span>
                                    </div>
                                    <span className="text-foreground text-2xl font-bold">
                                      {flight.price}
                                    </span>
                                  </div>

                                  <div className="flex flex-col gap-6 py-4 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex flex-1 flex-col">
                                      <span className="text-lg font-bold">
                                        {flight.departureTime}
                                      </span>
                                      <span className="text-muted-foreground text-sm font-medium">
                                        {flight.departureAirport}
                                      </span>
                                      <span className="text-muted-foreground mt-1 text-xs">
                                        {flight.departureDate}
                                      </span>
                                    </div>

                                    <div className="flex flex-[2] flex-col items-center gap-2 px-4">
                                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                        {flight.duration}
                                      </span>
                                      <div className="flex w-full items-center gap-2">
                                        <div className="bg-border h-px flex-1"></div>
                                        <Plane className="text-muted-foreground size-4 shrink-0" />
                                        <div className="bg-border h-px flex-1"></div>
                                      </div>
                                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                        {flight.stops}
                                      </span>
                                    </div>

                                    <div className="flex flex-1 flex-col items-start text-left sm:items-end sm:text-right">
                                      <span className="text-lg font-bold">
                                        {flight.arrivalTime}
                                      </span>
                                      <span className="text-muted-foreground text-sm font-medium">
                                        {flight.arrivalAirport}
                                      </span>
                                      <span className="text-muted-foreground mt-1 text-xs">
                                        {flight.arrivalDate}
                                      </span>
                                    </div>
                                  </div>

                                  <Button asChild className="mt-2 w-full font-semibold">
                                    <a href={kayakUrl} target="_blank" rel="noopener noreferrer">
                                      Select Flight
                                    </a>
                                  </Button>
                                </InteractiveCard>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* HOTELS */}
                      {data.hotels.length > 0 && (
                        <div className="space-y-8">
                          <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                            <Hotel className="text-primary size-8" /> Where to Stay
                          </h3>
                          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2">
                            {data.hotels.map((hotel, idx: number) => (
                              <HotelCard key={idx} hotel={hotel} destination={data.destination} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DAILY ITINERARY */}
                      <div className="space-y-10">
                        <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                          <Calendar className="text-primary size-8" /> Daily Itinerary
                        </h3>

                        <div className="space-y-12">
                          {data.days.map((day, idx: number) => (
                            <div key={idx} className="flex flex-col">
                              <div className="bg-muted/30 border-border/40 mb-8 inline-flex items-center gap-4 rounded-2xl border p-4 shadow-sm">
                                <div className="bg-background text-foreground flex size-12 shrink-0 items-center justify-center rounded-xl font-bold shadow-sm">
                                  D{idx + 1}
                                </div>
                                <div className="flex flex-col">
                                  <h4 className="text-xl font-bold">{day.date}</h4>
                                  <span className="text-muted-foreground text-sm font-medium">
                                    {day.title}
                                  </span>
                                </div>
                              </div>

                              <div className="ml-6 sm:ml-10">
                                {day.activities.map((act, actIdx: number) => (
                                  <ActivityCard
                                    key={actIdx}
                                    act={act}
                                    isLast={actIdx === day.activities.length - 1}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MOCK SECTIONS (Restaurants, Attractions, Weather) */}
                      <div className="border-border/30 space-y-16 border-t pt-10">
                        {data.restaurants && data.restaurants.length > 0 && (
                          <div className="space-y-8">
                            <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                              <Utensils className="text-primary size-8" /> Recommended Dining
                            </h3>
                            <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-3">
                              {data.restaurants.map((restaurant, i) => {
                                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  restaurant.name + " " + data.destination,
                                )}`;
                                return (
                                  <GlassCard
                                    key={i}
                                    className="border-border/40 flex h-full flex-col p-5"
                                  >
                                    <div className="bg-muted mb-4 h-32 w-full shrink-0 rounded-xl bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center" />
                                    <h4 className="mb-1 line-clamp-2 text-lg font-bold leading-tight">
                                      {restaurant.name}
                                    </h4>
                                    <p className="text-muted-foreground mb-2 text-xs font-semibold">
                                      {restaurant.cuisine}
                                    </p>
                                    <p className="text-muted-foreground mb-4 text-sm">
                                      {restaurant.description}
                                    </p>

                                    <div className="text-muted-foreground mb-4 flex flex-1 items-start gap-1.5 text-xs">
                                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                                      <span className="line-clamp-2 flex-1 break-words">
                                        {restaurant.address}
                                      </span>
                                    </div>

                                    <div className="border-border/30 mt-auto flex items-center justify-between border-t pt-4">
                                      <div className="flex items-center gap-2">
                                        <Star className="text-warning size-3.5 fill-current" />
                                        <span className="text-sm font-bold">
                                          {restaurant.rating.replace(/[^0-9.]/g, "") || "4.5"}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                          • {restaurant.price}
                                        </span>
                                      </div>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        className="shrink-0 font-semibold shadow-sm transition-shadow hover:shadow-md"
                                        onClick={() =>
                                          window.open(mapUrl, "_blank", "noopener,noreferrer")
                                        }
                                      >
                                        View Details
                                      </Button>
                                    </div>
                                  </GlassCard>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="space-y-8">
                          <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                            <CloudSun className="text-primary size-8" /> Weather Forecast
                          </h3>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {(
                              weatherData || [
                                { day: "Day 1", temp: "--", icon: Sun, condition: "Loading..." },
                                { day: "Day 2", temp: "--", icon: Sun, condition: "Loading..." },
                                { day: "Day 3", temp: "--", icon: Sun, condition: "Loading..." },
                                { day: "Day 4", temp: "--", icon: Sun, condition: "Loading..." },
                              ]
                            ).map((w, i) => (
                              <GlassCard
                                key={i}
                                className="border-border/40 flex flex-col items-center justify-center p-6 text-center"
                              >
                                <span className="text-muted-foreground mb-3 text-xs font-bold uppercase">
                                  {w.day}
                                </span>
                                <w.icon
                                  className={cn(
                                    "text-primary mb-3 size-8",
                                    !weatherData && "animate-pulse",
                                  )}
                                />
                                <span className="text-2xl font-bold">{w.temp}</span>
                                <span className="text-muted-foreground text-sm">{w.condition}</span>
                              </GlassCard>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* TIPS & PACKING */}
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <GlassCard className="border-border/40 border-t-primary border-t-4 p-8">
                          <h3 className="font-display mb-6 flex items-center gap-2 text-xl font-bold">
                            <Info className="text-primary size-6" /> Essential Travel Tips
                          </h3>
                          <div className="flex flex-col gap-4">
                            {tipsList.map((sentence, idx) => (
                              <div
                                key={idx}
                                className="bg-primary/5 text-foreground/80 flex items-start gap-3 rounded-xl p-4 text-sm"
                              >
                                <Info className="text-primary mt-0.5 size-4 shrink-0" />
                                <span className="leading-relaxed">{sentence.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </GlassCard>

                        {data.packingSuggestions && data.packingSuggestions.length > 0 && (
                          <GlassCard className="border-border/40 border-t-accent border-t-4 p-8">
                            <h3 className="font-display mb-6 flex items-center gap-2 text-xl font-bold">
                              <Navigation className="text-accent size-6" /> Packing List
                            </h3>
                            <div className="flex flex-col gap-3">
                              {data.packingSuggestions.map((item, idx: number) => (
                                <div
                                  key={idx}
                                  className="text-foreground/80 flex items-center gap-3 text-sm"
                                >
                                  <div className="border-accent/40 bg-accent/10 flex size-6 shrink-0 items-center justify-center rounded-md border">
                                    <Check className="text-accent size-3.5" />
                                  </div>
                                  <span className="font-medium">{item}</span>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
