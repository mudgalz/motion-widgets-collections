import { ArrowLeft } from "@/assets/icons";
import ClockOfClocks from "@/components/clocks/ClockOfClocks";
import PomodoroTimer from "@/components/clocks/PomodoroTimer";
import Stopwatch from "@/components/clocks/Stopwatch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Link } from "react-router-dom";

type ClockType = "stopwatch" | "pomodoro" | "digital" | "analog";

const Clocks = () => {
  const [clockType, setClockType] = useState<ClockType>("digital");

  const renderClock = () => {
    switch (clockType) {
      case "stopwatch":
        return <Stopwatch />;

      case "digital":
        return <ClockOfClocks />;

      case "pomodoro":
        return <PomodoroTimer />;
      default:
        return null; // must handle default
    }
  };

  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        <Link to="/" tabIndex={-1}>
          <Button title="Home" variant={"ghost"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-20 flex gap-1">
        <Select
          value={clockType}
          onValueChange={(val) => setClockType(val as ClockType)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Clock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="digital">Digital Clock</SelectItem>
            <SelectItem value="stopwatch">Stopwatch</SelectItem>
            <SelectItem value="pomodoro">Pomodoro Timer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderClock()}
    </>
  );
};

export default Clocks;
