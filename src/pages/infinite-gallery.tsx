import { ArrowLeft } from "@/assets/icons";
import InfiniteGallery from "@/components/infinite-gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useFetchImages } from "@/hooks/useFetchImages";
import useContainerImagesLoaded from "@/hooks/useImageLoading";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ThreeGallery() {
  const [searchQry, setSearchQry] = useState("");
  const debouncedQuery = useDebounce(searchQry, 700);

  const { data, isFetching } = useFetchImages({
    count: 50,
    query: debouncedQuery,
  });
  const { loading } = useContainerImagesLoaded(
    data?.map((img) => img.src) || []
  );
  const isLoading = loading || isFetching;

  return (
    <main className="min-h-screen">
      <div
        className={`fixed inset-0 flex items-center justify-center backdrop-blur text-3xl font-mono italic transition-all duration-700 ease-in-out z-30
          ${isLoading ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        Loading...
      </div>
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        <Link to="/" tabIndex={-1}>
          <Button title="Home" variant={"ghost"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>

      <Input
        disabled={isFetching}
        placeholder="Search Images"
        value={searchQry}
        onChange={(e) => setSearchQry(e.target.value?.trimStart())}
        className="pr-10 text-sm bg-transparent border ring-0 shadow-none focus-visible:ring-0 h-8 w-36 px-2 z-20 absolute top-4 right-4"
      />

      <InfiniteGallery
        images={data || []}
        speed={1.2}
        zSpacing={3}
        visibleCount={12}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full rounded-lg overflow-hidden"
      />

      <div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight">
          <span className="italic">It Works;</span> therefore it amazes.
        </h1>
      </div>

      <div className="text-center fixed bottom-5 left-0 right-0 font-mono uppercase text-[12px] font-semibold text-">
        <p>Use mouse wheel, arrow keys, or touch to navigate</p>
        <p className="opacity-60">
          Auto-play resumes after 3 seconds of inactivity
        </p>
      </div>
    </main>
  );
}
