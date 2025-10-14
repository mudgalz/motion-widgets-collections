import type { ImageItem } from "@/components/infinite-gallery/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface FetchImagesOptions {
  query?: string;
  count?: number;
}

const fetchPexelsImages = async (
  query?: string,
  count = 25
): Promise<ImageItem[]> => {
  const res = await axios.get(
    query
      ? `https://api.pexels.com/v1/search`
      : `https://api.pexels.com/v1/curated`,
    {
      params: {
        query,
        per_page: count,
      },
      headers: {
        Authorization: import.meta.env.VITE_PEXELS_API_KEY,
      },
    }
  );

  return res.data.photos.map((img: any) => ({
    src: img.src.large, // medium quality for fast render
    alt: img.alt || "Pexels image",
  }));
};

export const useFetchImages = ({ query, count = 25 }: FetchImagesOptions) => {
  return useQuery<ImageItem[], Error>({
    queryKey: ["images", query],
    queryFn: async () => {
      const pexelsImages = await fetchPexelsImages(query, count);
      return pexelsImages;
    },
  });
};
