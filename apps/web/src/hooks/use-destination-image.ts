import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/browser";

export function useDestinationImage(
  tripId: string,
  destination: string,
  initialUrl?: string | null,
) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialUrl || null);
  const supabase = createClient();

  useEffect(() => {
    if (initialUrl) return;

    let isMounted = true;

    const fetchImage = async () => {
      try {
        // Extract the most significant part of the destination (e.g., "Paris" from "Paris, France")
        const mainLocation = destination.split(",")[0].trim();

        // Use Wikipedia Page Images API as a reliable, free source without API keys
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(mainLocation)}&prop=pageimages&format=json&pithumbsize=800&origin=*`,
        );
        const wikiData = await wikiRes.json();
        const pages = wikiData.query.pages;
        const firstPage = Object.values(pages)[0] as any;

        let fetchedUrl = firstPage?.thumbnail?.source;

        // Fallback to LoremFlickr if Wikipedia has no image for this location
        if (!fetchedUrl) {
          fetchedUrl = `https://loremflickr.com/800/600/${encodeURIComponent(mainLocation)},city/all`;
        }

        if (isMounted) {
          setImageUrl(fetchedUrl);
        }

        // Cache the image in Supabase so we don't fetch it again
        await supabase.from("saved_itineraries").update({ image_url: fetchedUrl }).eq("id", tripId);
      } catch (err) {
        console.error("Failed to fetch image for", destination, err);
        // Absolute fallback to a generic beautiful landscape
        if (isMounted) {
          setImageUrl(
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=80",
          );
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [tripId, destination, initialUrl, supabase]);

  return imageUrl;
}
