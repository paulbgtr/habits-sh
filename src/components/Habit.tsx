import { Trash } from "lucide-react";
import React from "react";
import { Habit as HabitType, useUser } from "../state/user";
import { api } from "../utils/api";
import { getLast365Days } from "../utils/utils";
import { HabitCube } from "./HabitCube";

export const Habit: React.FC<HabitType> = ({ id, name, completed }) => {
  const { habits, deleteHabit } = useUser();
  const [completions, setCompletions] = React.useState(completed);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const last365Days = React.useMemo(getLast365Days, []);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollLeft = ref.current.scrollWidth;
  }, [ref.current]);

  const logDay = async (day: string) => {
    const newCompletions = [...completions, day];
    setCompletions(newCompletions);

    await api.post("/habits/log", {
      id: id,
      day: day,
    });
  };

  const unlogDay = async (day: string) => {
    const newCompletions = completions.filter(
      (completion) => completion !== day,
    );
    setCompletions(newCompletions);

    await api.post("/habits/unlog", {
      id: id,
      day: day,
    });
  };

  // Group days by month
  const months = React.useMemo(() => {
    const monthGroups: Record<string, number> = {};
    let currentMonth = "";
    let currentIndex = 0;
    last365Days.reverse().forEach((day, index) => {
      const month = day.split(" ").slice(2, 4).join(" "); // Extract month (e.g., "Jan")
      if (currentMonth !== month) {
        monthGroups[month] = index - currentIndex; // Store the start index of the month
        currentMonth = month;
        currentIndex = index;
      }
    });
    return monthGroups;
  }, [last365Days]);

  return (
    <div className="bg-dark-gray group flex flex-col gap-2 rounded-lg p-4 md:max-w-[750px]">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{name}</div>

        <button
          className="cursor-pointer p-2 duration-100 group-hover:opacity-100 md:opacity-0"
          onClick={() => deleteHabit(id)}
        >
          <Trash className="size-5 text-red-500" />
        </button>
      </div>

      <div className="flex flex-col gap-1 overflow-auto" ref={ref}>
        {/* Month Names */}
        <div className="flex text-ellipsis">
          {Object.entries(months).map(([month, startIndex]) => {
            const margin = startIndex / 7;

            return (
              <span
                style={{
                  marginLeft: `${margin * 13}px`,
                }}
              >
                {month.split(", ")[0]}
              </span>
            );
          })}
        </div>

        {/* Habit Days Grid */}
        <div className="grid w-fit grid-flow-col grid-rows-7 gap-1 overflow-auto">
          {last365Days.map((day, index) => (
            <HabitCube
              day={day}
              index={index}
              completions={completions}
              last365Days={last365Days}
              logDay={logDay}
              unlogDay={unlogDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
