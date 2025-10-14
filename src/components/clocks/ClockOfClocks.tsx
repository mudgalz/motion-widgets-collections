import { cell, equal, now, type Time } from "@/lib/clock-utils";
import { useEffect, useState } from "react";
import BottomInfoText from "../BottomInfoText";

/* ------------------------- Hand & Dot Components ------------------------- */
const Hand: React.FC<{ rotation: number }> = ({ rotation }) => (
  <div
    className="absolute top-1/2 left-1/2 origin-left bg-indigo-400 duration-500 ease-in-out shadow-[0_0_6px] shadow-indigo-700"
    style={{
      width: "calc(50% - 1px)",
      height: "2px",
      rotate: `${rotation}deg`,
    }}
  />
);

const Dot: React.FC = () => (
  <div
    className="absolute top-1/2 left-1/2 bg-indigo-400 rounded-full"
    style={{
      width: "2px",
      height: "2px",
      transform: "translate(-50%, 0%)",
    }}
  />
);

/* ------------------------- Cell Component ------------------------- */
const Cell: React.FC<{ rotations: number[] }> = ({ rotations }) => (
  <div className="relative rounded-full bg-indigo-800/5 border border-indigo-950/50 size-7 md:size-12">
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
const ClockOfClocks: React.FC = () => {
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
      <div className="flex justify-center items-center min-h-screen flex-col">
        <div className="flex gap-8 md:flex-row flex-col ">
          <Field name="hours" value={time.hours} />
          <Field name="minutes" value={time.minutes} />
          <Field name="seconds" value={time.seconds} />
        </div>
      </div>
      <BottomInfoText text="Digital clock that visualizes time using multiple mini analog clocks." />
    </>
  );
};

export default ClockOfClocks;
