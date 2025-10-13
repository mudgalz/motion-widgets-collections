import NeuroNoiseBG from "@/components/backgrounds/NeuroNoise";
import { Container } from "@/components/ui/Container";
import { Link } from "react-router-dom";

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
    desc: "An animated clock that visualizes time using hands of multiple mini clocks.",
  },
];

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-5 justify-center min-h-screen py-8">
      <NeuroNoiseBG />
      <h1 className="md:text-8xl text-4xl italic font-serif mix-blend-soft-light md:mb-20">
        Let's try some cool stuff
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
