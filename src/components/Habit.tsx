import classNames from "classnames";
import { Trash } from "lucide-react";
import React from "react";
import { Habit as HabitType, useUser } from "../state/user";
import { api } from "../utils/api";
import { getLast365Days } from "../utils/utils";
import { ConfirmModal } from "./ConfrimModal";
import { HabitCube } from "./HabitCube";

const parseDate = (dateStr: string): Date => {
  const [_, day, month, year] = dateStr.split(" ");
  const parsedDate = new Date(`${day} ${month} ${year}`);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return parsedDate;
};

const calculateStreaks = (completedDays: string[]) => {
  // Parse and sort dates
  const dates = completedDays
    .map(parseDate)
    .sort((a, b) => a.getTime() - b.getTime());

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null; // Explicitly define the type

  dates.forEach((date) => {
    console.log(`Current date: ${date}, Last date: ${lastDate}`);

    if (lastDate) {
      const diffDays =
        (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        // Increment current streak for consecutive days
        currentStreak++;
      } else if (diffDays > 1) {
        // Reset current streak for non-consecutive days
        currentStreak = 1;
      }
    } else {
      // Start the first streak
      currentStreak = 1;
    }

    // Update longest streak if needed
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    lastDate = date;
  });

  // Check if the last date is within the last two days
  const now = new Date();
  console.log(`Now: ${now}, Last date: ${lastDate}`);
  const theLastDate = dates[dates.length - 1]; // HOLY SHIT THIS IS ASS

  const diffLastDate = theLastDate
    ? (now.getTime() - theLastDate.getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;
  if (diffLastDate >= 2) {
    currentStreak = 0; // Reset current streak if last two days aren't completed
  }

  console.log(
    `Current Streak: ${currentStreak}, Longest Streak: ${longestStreak}`,
  );

  return { currentStreak, longestStreak };
};

export const Habit: React.FC<HabitType> = ({ id, name, completed }) => {
  const { deleteHabit } = useUser();
  const [completions, setCompletions] = React.useState(completed);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const last365Days = React.useMemo(getLast365Days, []);
  const { currentStreak, longestStreak } = React.useMemo(
    () => calculateStreaks(completions),
    [completions],
  );

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollLeft = ref.current.scrollWidth;
  }, []);

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
    <>
      {showDeleteModal && (
        <ConfirmModal
          description="Deleted habits can't be recovered"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteHabit(id);
            setShowDeleteModal(false);
          }}
        />
      )}
      <div className="group flex flex-col gap-2 rounded-lg bg-dark-gray p-4 md:max-w-[750px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">{name}</div>
            <div
              className={classNames("rounded-lg px-2 py-1 text-xs font-bold", {
                "bg-green-500": currentStreak > 0,
                "bg-light-gray": currentStreak === 0,
              })}
            >
              {currentStreak} DAY STREAK
            </div>
          </div>

          <button
            className="cursor-pointer p-2 duration-100 group-hover:opacity-100 md:opacity-0"
            onClick={() => setShowDeleteModal(true)}
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
    </>
  );
};
