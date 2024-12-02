import classNames from "classnames";
import React from "react";
import ConfettiExplosion from "react-confetti-explosion";

interface Props {
  day: string;
  completions: string[];
  index: number;
  last365Days: string[];

  logDay: (day: string) => void;
  unlogDay: (day: string) => void;
}

export const HabitCube: React.FC<Props> = ({
  day,
  completions,
  index,
  last365Days,
  logDay,
  unlogDay,
}) => {
  const [gotLogged, setGotLogged] = React.useState(false);

  return (
    <div
      key={day}
      className={classNames(
        "size-4 cursor-pointer rounded-sm border-[1px] border-transparent",
        {
          "bg-gray hover:bg-light-gray": !completions.includes(day),
          "bg-green-500": completions.includes(day),
          "border-white": index === last365Days.length - 1,
        },
      )}
      onClick={() => {
        if (completions.includes(day)) {
          unlogDay(day);
          setGotLogged(false);
        } else {
          logDay(day);
          setGotLogged(true);
        }
      }}
    >
      {gotLogged && <ConfettiExplosion particleCount={50} />}
    </div>
  );
};
