import type { ReactElement } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import RingsShader from "./components/shaders/Rings";
import SunCtrlShader from "./components/shaders/SunRaymarch";
import ThreeGallery from "./pages/gallery";
import Home from "./pages/home";

interface AppRoute {
  path: string;
  element: ReactElement;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

const routes: AppRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/infinite-gallery", element: <ThreeGallery /> },
  { path: "/axel-rings", element: <RingsShader /> },
  { path: "/sunset-raymarch", element: <SunCtrlShader /> },
];

export default function App() {
  const location = useLocation();

  return (
    <>
      <Routes location={location} key={location.pathname}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
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
