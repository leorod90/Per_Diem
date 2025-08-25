import { addDays, format, parse, set, setHours, setMinutes } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';

export type NextDays = { month: string; day: string; year: string }

export const generateNext30Days = (timezone: string) => {
  const today = new Date();
  const dates: NextDays[] = [];

  for (let i = 0; i < 30; i++) {
    const nextDate = addDays(today, i);
    const zonedDate = toZonedTime(nextDate, timezone);

    dates.push({
      month: format(zonedDate, "LLL"),
      day: format(zonedDate, "dd"),
      year: format(zonedDate, "yy"),
    });
  }

  return dates;
};

export function generateTimeSlots(interval = 15) {
  const slots = [];
  let start = 0;
  const end = 24 * 60;

  while (start < end) {
    const hours = Math.floor(start / 60).toString().padStart(2, "0");
    const minutes = (start % 60).toString().padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
    start += interval;
  }

  return slots;
}

export function formatToAmPm(time24: string | undefined): string {
  try {
    const [hourStr, minuteStr] = time24!.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  } catch (error) {
    return "Please select a time."
  }
}

export const getCityFromTimeZone = (timezone: string): string => {
  const parts = timezone.split('/');
  return parts[1].replace(/_/g, ' ');
};

export const convertTimeToTimeZone = (
  time: string,
  fromTZ: string,
  toTZ: string
): string => {
  const today = new Date();
  const [hours, minutes] = time.split(':').map(Number);

  const baseDate = set(today, { hours, minutes, seconds: 0, milliseconds: 0 });
  const utcDate = fromZonedTime(baseDate, fromTZ);
  const converted = formatInTimeZone(utcDate, toTZ, 'HH:mm');

  return converted;
};

export function getGreeting(hour: number): string {
  if (hour >= 5 && hour <= 9) return `Good Morning,`;
  if (hour >= 10 && hour <= 11) return `Late Morning Vibes`;
  if (hour >= 12 && hour <= 16) return `Good Afternoon,`;
  if (hour >= 17 && hour <= 20) return `Good Evening!`;
  return `Night Owl in`;
}

const LOCAL = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const TimeZones = {
  Local: LOCAL,
  LosAngeles: "America/Los_Angeles",
} as const;

export interface TimeZoneType {
  timeZone: string;
  label: string;
}

export const TIME_ZONES: TimeZoneType[] = [
  { timeZone: TimeZones.Local, label: getCityFromTimeZone(TimeZones.Local) },
  { timeZone: TimeZones.LosAngeles, label: getCityFromTimeZone(TimeZones.LosAngeles) },
];