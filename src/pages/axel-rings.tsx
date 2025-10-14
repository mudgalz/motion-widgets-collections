import { ArrowLeft } from "@/assets/icons";
import RingsCanvas from "@/components/axel-rings";
import BottomInfoText from "@/components/BottomInfoText";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AxelRings: React.FC = () => {
  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        <Link to="/" tabIndex={-1}>
          <Button title="Home" variant={"ghost"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>
      <RingsCanvas />
      <BottomInfoText text="Interactive rings that respond to mouse movements." />
    </>
  );
};

export default AxelRings;
