import { Container } from "@/components/ui/Container";
import { NeuroNoise } from "@paper-design/shaders-react";
import { Link } from "react-router";
const pages = [
  {
    id: 1,
    url: "/axel-rings",
    name: "Axel Rings",
    desc: "Interactive concentric rings allowing you to control speed, spacing, and color transitions using mouse.",
  },
  {
    id: 2,
    url: "/sunset-raymarch",
    name: "Sunset Raymarch",
    desc: "A dynamic sunset scene over the sea, where the sun position, lighting, and wave effects can be controlled with the mouse.",
  },
  {
    id: 3,
    url: "/infinite-gallery",
    name: "Infinite Gallery",
    desc: "Explore an infinite image scroll gallery powered by shaders and live search functionality.",
  },
  {
    id: 4,
    url: "/clock-of-clocks",
    name: "Clock of Clocks",
    desc: "A collection of interactive and animated clocks including digital, analog, stopwatch, and countdown timers.",
  },
];

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-5 justify-center min-h-screen py-8">
      <NeuroNoise
        colorFront="#47a6ff"
        colorMid="#5c4dff"
        colorBack="#000000"
        brightness={0.05}
        contrast={0.2}
        speed={2}
        scale={0.8}
        style={{ width: "100%", height: "100%" }}
        className="fixed inset-0 w-full h-full -z-10 bg-gray-950"
      />
      <h1 className="md:text-8xl text-shadow-xs text-shadow-black text-center text-4xl italic font-serif mix-blend-soft-light md:mb-20">
        Some cool stuff.
      </h1>

      <Container className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pages.map((page) => (
            <Link key={page.id} to={page.url}>
              <div className="flex flex-col items-center justify-center border bg-black/20 backdrop-blur-md rounded-lg p-6 text-center duration-300 hover:bg-white/10 hover:scale-105 shadow-lg shadow-black/50">
                <h1 className="text-2xl font-semibold mb-2 font-mono">
                  {page.name}
                </h1>
                <p>{page.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
