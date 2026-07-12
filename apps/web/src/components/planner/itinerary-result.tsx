"use client";

import React, { useState } from "react";
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

export function ItineraryResult({
  data,
  request,
}: {
  data: TripPlanResponse;
  request: TripPlanRequest;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const supabase = createClient();

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
                          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {data.flights.map((flight, idx: number) => (
                              <InteractiveCard key={idx} className="border-border/40 p-6">
                                <div className="mb-4 flex items-center justify-between">
                                  <h4 className="text-xl font-bold">{flight.airline}</h4>
                                  <span className="text-foreground text-xl font-bold">
                                    {flight.price}
                                  </span>
                                </div>
                                <div className="mb-6 flex items-center gap-4">
                                  <div className="flex-1 text-center">
                                    <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest">
                                      Route
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {flight.route.split("•")[0]?.trim() || flight.route}
                                    </span>
                                  </div>
                                  <div className="bg-border h-px flex-1"></div>
                                  <Plane className="text-muted-foreground size-4 shrink-0" />
                                  <div className="bg-border h-px flex-1"></div>
                                  <div className="flex-1 text-center">
                                    <span className="text-muted-foreground block text-[10px] font-bold uppercase tracking-widest">
                                      Duration
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {flight.route.split("•")[1]?.trim() || "Varies"}
                                    </span>
                                  </div>
                                </div>
                                <Button className="w-full font-semibold">Select Flight</Button>
                              </InteractiveCard>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* HOTELS */}
                      {data.hotels.length > 0 && (
                        <div className="space-y-8">
                          <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                            <Hotel className="text-primary size-8" /> Where to Stay
                          </h3>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {data.hotels.map((hotel, idx: number) => (
                              <InteractiveCard
                                key={idx}
                                className="border-border/40 flex flex-col overflow-hidden p-0"
                              >
                                <div className="bg-muted relative h-48 w-full">
                                  <img
                                    src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop`}
                                    alt="Hotel"
                                    className="h-full w-full object-cover"
                                  />
                                  {hotel.bestMatch && (
                                    <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                                      Top Pick
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                  <h4 className="mb-2 text-xl font-bold leading-tight">
                                    {hotel.name}
                                  </h4>
                                  <p className="text-muted-foreground mb-4 flex items-center gap-1.5 text-sm">
                                    <MapPin className="size-4" /> {hotel.location}
                                  </p>
                                  {hotel.meta && (
                                    <p className="text-foreground/80 mb-6 text-sm">{hotel.meta}</p>
                                  )}
                                  <div className="border-border/30 mt-auto flex items-center justify-between border-t pt-4">
                                    <span className="text-muted-foreground text-sm font-bold">
                                      Price varies
                                    </span>
                                    <Button variant="secondary" size="sm" className="font-semibold">
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </InteractiveCard>
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
                        <div className="space-y-8">
                          <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                            <Utensils className="text-primary size-8" /> Recommended Dining
                          </h3>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {/* Static mock data */}
                            {[1, 2, 3].map((i) => (
                              <GlassCard key={i} className="border-border/40 p-5">
                                <div className="bg-muted mb-4 h-32 w-full rounded-xl bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&auto=format&fit=crop')] bg-cover bg-center" />
                                <h4 className="font-bold">Local Cuisine {i}</h4>
                                <p className="text-muted-foreground text-xs">
                                  Authentic local dining experience
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                  <Star className="text-warning size-4 fill-current" />
                                  <span className="text-sm font-bold">4.{8 - i}</span>
                                  <span className="text-muted-foreground text-xs">• $$</span>
                                </div>
                              </GlassCard>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-8">
                          <h3 className="font-display flex items-center gap-3 text-3xl font-bold">
                            <CloudSun className="text-primary size-8" /> Weather Forecast
                          </h3>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                              { day: "Day 1", temp: "72°F", icon: Sun, condition: "Sunny" },
                              {
                                day: "Day 2",
                                temp: "68°F",
                                icon: CloudSun,
                                condition: "Partly Cloudy",
                              },
                              {
                                day: "Day 3",
                                temp: "65°F",
                                icon: CloudRain,
                                condition: "Light Rain",
                              },
                              {
                                day: "Day 4",
                                temp: "75°F",
                                icon: ThermometerSun,
                                condition: "Clear",
                              },
                            ].map((w, i) => (
                              <GlassCard
                                key={i}
                                className="border-border/40 flex flex-col items-center justify-center p-6 text-center"
                              >
                                <span className="text-muted-foreground mb-3 text-xs font-bold uppercase">
                                  {w.day}
                                </span>
                                <w.icon className="text-primary mb-3 size-8" />
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
