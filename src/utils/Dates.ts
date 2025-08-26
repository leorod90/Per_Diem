import { addDays, format, Month, set } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { DayOfWeek, StoreOverride } from "../types/StoreTypes";

export type NextDays = {
  month: string;
  day: string;
  year: string;
  dayName:string;
  dayNum: number;
  monthNum: number;
}

export const generateNext30Days = (timezone: string) => {
  const today = new Date();
  const dates: NextDays[] = [];

  for (let i = 0; i < 30; i++) {
    const nextDate = addDays(today, i);
    const zonedDate = toZonedTime(nextDate, timezone);

    const dayNum = (zonedDate.getDay() === 0 ? 7 : zonedDate.getDay()) as DayOfWeek;
    const monthNum = (zonedDate.getMonth() + 1) as Month;

    dates.push({
      month: format(zonedDate, "LLL"),
      day: format(zonedDate, "dd"),
      year: format(zonedDate, "yy"),
      dayName: format(zonedDate, "EEE"),
      dayNum,
      monthNum,
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

export function isStoreOpenAtTime(
  overrides: StoreOverride[],
  day: number,
  month: number,
  time: string
): boolean {
  const nowMinutes = time
    .split(':')
    .map(Number)
    .reduce((acc, val, idx) => acc + (idx === 0 ? val * 60 : val), 0);

  const exception = overrides.find(e => e.day === day && e.month === month);

  if (!exception) return true;
  if (!exception.is_open) return false;

  const [startH, startM] = exception.start_time.split(':').map(Number);
  const [endH, endM] = exception.end_time.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (endMinutes < startMinutes) {
    return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
  }

  return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
}


export function isDateTimeClosedOverride(selectedDate, selectedTime, closedPeriods) {
  // Parse the selected date
  const selectedDay = parseInt(selectedDate.day);
  const selectedMonth = parseInt(selectedDate.monthNum);

  // Parse the selected time (assuming format like "18:45")
  const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
  const selectedTimeInMinutes = selectedHour * 60 + selectedMinute;

  // Check each closed period
  for (const period of closedPeriods) {
    // Only check periods that are marked as closed (is_open: false)
    if (period.is_open === false) {
      // Check if the date matches
      if (period.day === selectedDay && period.month === selectedMonth) {
        // Parse start and end times
        const [startHour, startMinute] = period.start_time.split(':').map(Number);
        const [endHour, endMinute] = period.end_time.split(':').map(Number);

        const startTimeInMinutes = startHour * 60 + startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        // Handle edge cases for time comparison
        if (startTimeInMinutes === endTimeInMinutes) {
          // All day closure (like 00:00 to 00:00)
          return true;
        } else if (endTimeInMinutes < startTimeInMinutes) {
          // Time spans midnight (e.g., 23:00 to 02:00)
          if (selectedTimeInMinutes >= startTimeInMinutes || selectedTimeInMinutes <= endTimeInMinutes) {
            return true;
          }
        } else {
          // Normal time range within the same day
          if (selectedTimeInMinutes >= startTimeInMinutes && selectedTimeInMinutes <= endTimeInMinutes) {
            return true;
          }
        }
      }
    }
  }

  return false;
}


export function roundToNearest15(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  let minutes = parseInt(minuteStr, 10);

  const roundedMinutes = Math.round(minutes / 15) * 15;

  if (roundedMinutes === 60) {
    hour = (hour + 1) % 24;
    minutes = 0;
  } else {
    minutes = roundedMinutes;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const getDayName = (day: DayOfWeek) => {
  switch (day) {
    case DayOfWeek.SUNDAY: return "Sun";
    case DayOfWeek.MONDAY: return "Mon";
    case DayOfWeek.TUESDAY: return "Tue";
    case DayOfWeek.WEDNESDAY: return "Wed";
    case DayOfWeek.THURSDAY: return "Thu";
    case DayOfWeek.FRIDAY: return "Fri";
    case DayOfWeek.SATURDAY: return "Sat";
  }
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