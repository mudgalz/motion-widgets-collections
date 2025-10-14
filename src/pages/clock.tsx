import { ArrowLeft } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { cell, equal, now, type Time } from "@/lib/clock-utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------- Hand & Dot Components ------------------------- */
const Hand: React.FC<{ rotation: number }> = ({ rotation }) => (
  <div
    className="absolute top-1/2 left-1/2 origin-left bg-yellow-400 duration-500 ease-in-out"
    style={{
      width: "calc(50% - 1px)",
      height: "2px",
      rotate: `${rotation}deg`,
    }}
  />
);

const Dot: React.FC = () => (
  <div
    className="absolute top-1/2 left-1/2 bg-yellow-400 rounded-full"
    style={{
      width: "2px",
      height: "2px",
      transform: "translate(-50%, 0%)",
    }}
  />
);

/* ------------------------- Cell Component ------------------------- */
const Cell: React.FC<{ rotations: number[] }> = ({ rotations }) => (
  <div className="relative rounded-full bg-transparent border border-accent size-7 md:size-12">
    <Hand rotation={rotations[0]} />
    <Hand rotation={rotations[1]} />
    <Dot />
  </div>
);

/* ------------------------- Digit Component ------------------------- */
const Digit: React.FC<{ value: string }> = ({ value }) => {
  const cells = Array.from({ length: 24 }, (_, i) => (
    <Cell key={i} rotations={cell(value, i)} />
  ));
  return <div className="grid grid-cols-4 grid-rows-6 gap-0.5">{cells}</div>;
};

/* ------------------------- Field Component ------------------------- */
const Field: React.FC<{
  name: "hours" | "minutes" | "seconds";
  value: string;
}> = ({ name, value }) => (
  <div className="flex gap-0.5" data-field={name}>
    <Digit value={value[0]} />
    <Digit value={value[1]} />
  </div>
);

/* ------------------------- Main Clock Component ------------------------- */
const Clock: React.FC = () => {
  const [time, setTime] = useState<Time>(now());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = now();
      if (!equal(current, time)) {
        setTime(current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        <Link to="/" tabIndex={-1}>
          <Button title="Home" variant={"ghost"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="flex gap-8 md:flex-row flex-col ">
          <Field name="hours" value={time.hours} />
          <Field name="minutes" value={time.minutes} />
          <Field name="seconds" value={time.seconds} />
        </div>
      </div>
    </>
  );
};

export default Clock;
