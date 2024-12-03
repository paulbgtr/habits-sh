export function getLast365Days() {
  const days = [];
  const fillers = [];
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const dayName = day.toLocaleString("en-US", { weekday: "short" }); // Day name (e.g., Mon, Tue)
    const monthName = day.toLocaleString("en-US", { month: "short" }); // Month name (e.g., Jan, Feb)

    days.push(
      `${dayName}, ${day.getDate()} ${monthName}, ${day.getFullYear()}`,
    );
  }

  // Add "FILLER" entries to start the week on Sunday
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - 364); // Start of the range
  const firstDayIndex = firstDay.getDay(); // Sunday = 0, Monday = 1, ...

  for (let i = 0; i < firstDayIndex; i++) {
    fillers.push("FILLER");
  }

  return [...days, ...fillers];
}

export function generateRandomString(length = 16) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
}

export const syncCode = (code: string) => {
  localStorage.setItem("ID", code);
};
