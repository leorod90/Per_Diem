// store/timeStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkIfOpenOnDate, ConvertNextDays, convertTimeToTimeZone, NextDays, TIME_ZONES, TimeZones, TimeZoneType } from "../utils/Dates";

const STORAGE_TIME_KEY = '@per_diem/time_token';
const STORAGE_TIME_ZONE_KEY = '@per_diem/time_zone_token';
const STORAGE_TIME_DATE = '@per_diem/time_zone_date';

interface TimeState {
  selectedTimeZone: TimeZoneType;
  selectedTime?: string;
  selectedDate?: NextDays;
  setSelectedTimeZone: (zone: TimeZoneType) => Promise<void>;
  setSelectedTime: (time: string) => Promise<void>;
  setSelectedDate: (date: NextDays) => Promise<void>;
  resetDates: () => Promise<void>;
  fetchTimes: () => Promise<void>;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  selectedTimeZone: TIME_ZONES[1],
  selectedTime: undefined,
  selectedDate: undefined,

  setSelectedTimeZone: async (zone: TimeZoneType) => {
    const currentState = get();
    let convertNextDays: ConvertNextDays | null = null;
    const { selectedDate, selectedTime } = currentState;

    const referenceDate = selectedDate
      ? new Date(
        Number(selectedDate.year) + 2000,
        Number(selectedDate.monthNum) - 1,
        Number(selectedDate.day)
      )
      : undefined;

    await AsyncStorage.setItem(STORAGE_TIME_ZONE_KEY, JSON.stringify(zone));
    if (currentState.selectedTime && currentState.selectedTimeZone) {
      if (zone.timeZone === TimeZones.Local) {
        convertNextDays = convertTimeToTimeZone(
          currentState.selectedTime,
          TimeZones.LosAngeles,
          TimeZones.Local,
          referenceDate
        );
      } else if (zone.timeZone === TimeZones.LosAngeles) {
        convertNextDays = convertTimeToTimeZone(
          currentState.selectedTime,
          TimeZones.Local,
          TimeZones.LosAngeles,
          referenceDate
        );
      }
    }

    if (convertNextDays?.time) {
      await AsyncStorage.setItem(STORAGE_TIME_KEY, convertNextDays.time);
      const isStoreOpen = await checkIfOpenOnDate(convertNextDays.time, convertNextDays);
      const newSelectedDate = { ...convertNextDays, isStoreOpen };

      await AsyncStorage.setItem(STORAGE_TIME_DATE, JSON.stringify(newSelectedDate));

      set({
        selectedTimeZone: zone,
        selectedDate: newSelectedDate,
        selectedTime: newSelectedDate.time
      });
    } else {
      set({
        selectedTimeZone: zone,
        selectedTime: selectedTime
      });
    }
  },

  setSelectedTime: async (time: string) => {
    await AsyncStorage.setItem(STORAGE_TIME_KEY, time);
    set({ selectedTime: time });
  },

  setSelectedDate: async (date: NextDays) => {
    await AsyncStorage.setItem(STORAGE_TIME_DATE, JSON.stringify(date));
    set({ selectedDate: date });
  },

  resetDates: async () => {
    await AsyncStorage.removeItem(STORAGE_TIME_KEY);
    await AsyncStorage.removeItem(STORAGE_TIME_ZONE_KEY);
    await AsyncStorage.removeItem(STORAGE_TIME_DATE);

    set({ selectedTimeZone: TIME_ZONES[1], selectedTime: undefined, selectedDate: undefined });
  },

  fetchTimes: async () => {
    const zone = await AsyncStorage.getItem(STORAGE_TIME_ZONE_KEY);
    const time = await AsyncStorage.getItem(STORAGE_TIME_KEY);
    const date = await AsyncStorage.getItem(STORAGE_TIME_DATE);

    set({
      selectedTimeZone: zone ? JSON.parse(zone) : TIME_ZONES[1],
      selectedTime: time || undefined,
      selectedDate: date ? JSON.parse(date) : undefined,
    });
  },
}));