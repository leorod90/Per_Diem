import { addDays, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

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

export const getCityFromTimeZone = (timezone: string): string => {
  const parts = timezone.split('/');
  return parts[1].replace(/_/g, ' ');
};


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