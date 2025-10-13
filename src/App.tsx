import { Route, Routes } from "react-router-dom";
import RingsShader from "./components/shaders/Rings";
import SunCtrlShader from "./components/shaders/SunRaymarch";
import Clock from "./pages/clock";
import ThreeGallery from "./pages/gallery";
import Home from "./pages/home";

export default function App() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/infinite-gallery" element={<ThreeGallery />} />
        <Route path="/axel-rings" element={<RingsShader />} />
        <Route path="/sunset-raymarch" element={<SunCtrlShader />} />
        <Route path="/clock-of-clocks" element={<Clock />} />
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
