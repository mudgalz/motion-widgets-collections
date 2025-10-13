const rotation = {
  " ": [135, 135],
  "┘": [180, 270],
  "└": [0, 270],
  "┐": [90, 180],
  "┌": [0, 90],
  "-": [0, 180],
  "|": [90, 270],
};

const digits = {
  "0": [
    "┌",
    "-",
    "-",
    "┐",
    "|",
    "┌",
    "┐",
    "|",
    "|",
    "|",
    "|",
    "|",
    "|",
    "|",
    "|",
    "|",
    "|",
    "└",
    "┘",
    "|",
    "└",
    "-",
    "-",
    "┘",
  ],

  "1": [
    "┌",
    "-",
    "┐",
    " ",
    "└",
    "┐",
    "|",
    " ",
    " ",
    "|",
    "|",
    " ",
    " ",
    "|",
    "|",
    " ",
    "┌",
    "┘",
    "└",
    "┐",
    "└",
    "-",
    "-",
    "┘",
  ],

  "2": [
    "┌",
    "-",
    "-",
    "┐",
    "└",
    "-",
    "┐",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "└",
    "-",
    "┐",
    "└",
    "-",
    "-",
    "┘",
  ],

  "3": [
    "┌",
    "-",
    "-",
    "┐",
    "└",
    "-",
    "┐",
    "|",
    " ",
    "┌",
    "┘",
    "|",
    " ",
    "└",
    "┐",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "└",
    "-",
    "-",
    "┘",
  ],

  "4": [
    "┌",
    "┐",
    "┌",
    "┐",
    "|",
    "|",
    "|",
    "|",
    "|",
    "└",
    "┘",
    "|",
    "└",
    "-",
    "┐",
    "|",
    " ",
    " ",
    "|",
    "|",
    " ",
    " ",
    "└",
    "┘",
  ],

  "5": [
    "┌",
    "-",
    "-",
    "┐",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "└",
    "-",
    "┐",
    "└",
    "-",
    "┐",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "└",
    "-",
    "-",
    "┘",
  ],

  "6": [
    "┌",
    "-",
    "-",
    "┐",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "└",
    "-",
    "┐",
    "|",
    "┌",
    "┐",
    "|",
    "|",
    "└",
    "┘",
    "|",
    "└",
    "-",
    "-",
    "┘",
  ],

  "7": [
    "┌",
    "-",
    "-",
    "┐",
    "└",
    "-",
    "┐",
    "|",
    " ",
    " ",
    "|",
    "|",
    " ",
    " ",
    "|",
    "|",
    " ",
    " ",
    "|",
    "|",
    " ",
    " ",
    "└",
    "┘",
  ],

  "8": [
    "┌",
    "-",
    "-",
    "┐",
    "|",
    "┌",
    "┐",
    "|",
    "|",
    "└",
    "┘",
    "|",
    "|",
    "┌",
    "┐",
    "|",
    "|",
    "└",
    "┘",
    "|",
    "└",
    "-",
    "-",
    "┘",
  ],

  "9": [
    "┌",
    "-",
    "-",
    "┐",
    "|",
    "┌",
    "┐",
    "|",
    "|",
    "└",
    "┘",
    "|",
    "└",
    "-",
    "┐",
    "|",
    "┌",
    "-",
    "┘",
    "|",
    "└",
    "-",
    "-",
    "┘",
  ],
};

const cell = (value: string, index: number) => {
  const digit = digits[value as DigitKey];

  if (digit) {
    const symbol = digit[index] as RotationKey;

    const pair = rotation[symbol];

    if (pair) return pair;
  }

  return rotation[" "];
};

const now = (): Time => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const string = time.split(" ")[0];

  const [hours, minutes, seconds] = string.split(":");

  return {
    hours,
    minutes,
    seconds,
  };
};

const equal = (a: Time, b: Time) => {
  return (
    a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds
  );
};

type DigitKey = keyof typeof digits;
type RotationKey = keyof typeof rotation;
type Time = {
  hours: string;
  minutes: string;
  seconds: string;
};

export type { DigitKey, RotationKey, Time };
export { cell, now, equal, digits, rotation };
