import { Plus } from "lucide-react";
import React from "react";
import { Habit } from "../components/Habit";
import { Page } from "../components/Page";
import { useUser } from "../state/user";

export default function Home() {
  const { habits, createHabit, updateUserInfo } = useUser();

  React.useEffect(() => {
    updateUserInfo();
  }, [localStorage]);

  return (
    <Page>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-6xl font-bold">habits</h1>
        <h2 className="text-light-gray">Track your habits every day</h2>
      </div>

      <div className="flex w-fit max-w-full flex-col gap-2 md:min-w-[750px]">
        {habits?.map((habit) => <Habit {...habit} />)}

        <button
          className="bg-gray flex h-24 w-full items-center justify-center gap-2 rounded-lg text-xl font-bold duration-100 hover:bg-opacity-80"
          onClick={() => createHabit("testing")}
        >
          <Plus className="size-8" /> Create
        </button>
      </div>
    </Page>
  );
}
