import { Route, Routes } from "react-router-dom";
import { AxelRings, Clocks, Home, SunRaymarch, ThreeGallery } from "./pages";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/infinite-gallery" element={<ThreeGallery />} />
        <Route path="/axel-rings" element={<AxelRings />} />
        <Route path="/sunset-raymarch" element={<SunRaymarch />} />
        <Route path="/clocks" element={<Clocks />} />
      </Routes>

      <a
        tabIndex={-1}
        href="https://mudgal.framer.ai"
        target="_blank"
        className="fixed bottom-2 right-2 text-xs text-gray-400/50">
        Here I'm
      </a>
    </>
  );
}
