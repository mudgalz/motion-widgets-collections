import { ArrowLeft } from "@/assets/icons";
import BottomInfoText from "@/components/BottomInfoText";
import SunRaymarchCanvas from "@/components/sun-raymarch";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SunRaymarch: React.FC = () => {
  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        <Link to="/" tabIndex={-1}>
          <Button title="Home" variant={"ghost"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>
      <SunRaymarchCanvas />
      <BottomInfoText text="Interactive sun and wave simulation using mouse control." />
    </>
  );
};

export default SunRaymarch;
