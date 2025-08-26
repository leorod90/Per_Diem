import { addDays, format, isAfter, isBefore, Month, parse, set } from "date-fns";
import { toZonedTime, formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { DayOfWeek, StoreOverride, StoreTime } from "../types/StoreTypes";
import { getStoreTimesByDay } from "../api/StoreTimeAPI";
import { getStoreOverridesByMonthAndDay } from "../api/StoreOverrides";
import axios from "axios";

export type NextDays = {
  month: string;
  day: string;
  year: string;
  dayName: string;
  dayNum: number;
  monthNum: number;
  isStoreOpen?: boolean;
}

export const generateNext30Days = (timezone: string) => {
  const today = new Date();
  const dates: NextDays[] = [];

  for (let i = 0; i < 30; i++) {
    const nextDate = addDays(today, i);
    const zonedDate = toZonedTime(nextDate, timezone);

    const dayNum = (zonedDate.getDay() + 1) as DayOfWeek;
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

export function formatToAmPm(time24: string | undefined): string | null {
  try {
    const [hourStr, minuteStr] = time24!.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  } catch (error) {
    return null;
  }
}

export const getCityFromTimeZone = (timezone: string): string => {
  const parts = timezone.split('/');
  return parts[1].replace(/_/g, ' ');
};

export interface ConvertNextDays extends NextDays{
  time:string;
}

export const convertTimeToTimeZone = (
  time: string,
  fromTZ: string,
  toTZ: string,
  referenceDate?: Date,
) => {
  const [hours, minutes] = time.split(":").map(Number);
  
  const baseDate = set(referenceDate ?? new Date(), { hours, minutes, seconds: 0, milliseconds: 0 });
  const sourceDate = fromZonedTime(baseDate, fromTZ);

  return {
    day: formatInTimeZone(sourceDate, toTZ, "dd"),
    dayName: formatInTimeZone(sourceDate, toTZ, "EEE"),
    dayNum: Number(formatInTimeZone(sourceDate, toTZ, "e")),
    month: formatInTimeZone(sourceDate, toTZ, "MMM"),
    monthNum: Number(formatInTimeZone(sourceDate, toTZ, "M")),
    year: formatInTimeZone(sourceDate, toTZ, "yy"),
    time: formatInTimeZone(sourceDate, toTZ, "HH:mm"),
  };
};


export function getGreeting(hour: number): string {
  if (hour >= 5 && hour <= 9) return `Good Morning,`;
  if (hour >= 10 && hour <= 11) return `Late Morning Vibes`;
  if (hour >= 12 && hour <= 16) return `Good Afternoon,`;
  if (hour >= 17 && hour <= 20) return `Good Evening!`;
  return `Night Owl in`;
}

interface StoreTimeCheck {
  start_time: string;
  end_time: string;
  is_open: boolean;
}

export const checkIfOpenOnDate = async (
  selectedTime: string,
  selectedDate: NextDays
): Promise<boolean> => {
  try {
    
    const dayOfWeekData: StoreTimeCheck[] = await getStoreTimesByDay(selectedDate.dayNum);
    const overrideData: StoreTimeCheck[] | null = await getStoreOverridesByMonthAndDay(
      selectedDate.monthNum,
      +selectedDate.day
    );
   
    const checkOpen = (storeTimes: StoreTimeCheck[]) => {
      for (const time of storeTimes) {
        if (!time.is_open || !time.start_time || !time.end_time) continue;

        const selected = parse(selectedTime, "HH:mm", new Date());
        const start = parse(time.start_time, "HH:mm", new Date());
        const end = parse(time.end_time, "HH:mm", new Date());

        if (isAfter(selected, start) && isBefore(selected, end)) {
          return true;
        }
      }
      return false;
    };

    if (overrideData && overrideData.length > 0) {
      return checkOpen(overrideData);
    }
    return checkOpen(dayOfWeekData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
      console.log(error.response?.status);
    }
    return false;
  }
};

export function roundToNearest30(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  let minutes = parseInt(minuteStr, 10);

  const roundedMinutes = Math.round(minutes / 30) * 30;

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