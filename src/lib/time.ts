/** Parse "8:00 AM", "12:30 PM", or "08:00" into minutes since midnight. */
export function parseTimeToMinutes(value: string): number {
  const trimmed = value.trim();
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hours = Number(ampm[1]) % 12;
    if (ampm[3].toUpperCase() === "PM") hours += 12;
    return hours * 60 + Number(ampm[2]);
  }

  const twentyFour = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFour) {
    return (Number(twentyFour[1]) % 24) * 60 + Number(twentyFour[2]);
  }

  return 8 * 60;
}

/** Format as 12-hour display matching existing reminder defaults. */
export function formatTimeDisplay(hours: number, minutes: number): string {
  const h = ((hours % 24) + 24) % 24;
  const m = ((minutes % 60) + 60) % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
}
