// store/timeStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertTimeToTimeZone, TIME_ZONES, TimeZones, TimeZoneType } from "../utils/Dates";
import { format, toZonedTime } from "date-fns-tz";

const STORAGE_TIME_KEY = '@per_diem/time_token';
const STORAGE_TIME_ZONE_KEY = '@per_diem/time_zone_token';

interface TimeState {
  selectedTimeZone: TimeZoneType;
  selectedTime?: string;
  setSelectedTimeZone: (zone: TimeZoneType) => Promise<void>;
  setSelectedTime: (time: string) => Promise<void>;
  resetDates: () => Promise<void>; 
  fetchTimes: () => Promise<void>;
}

export const useTimeStore = create<TimeState>((set, get) => ({
  selectedTimeZone: TIME_ZONES[1],
  selectedTime: undefined,

  setSelectedTimeZone: async (zone: TimeZoneType) => {
    const currentState = get();
    await AsyncStorage.setItem(STORAGE_TIME_ZONE_KEY, JSON.stringify(zone));
    let convertedTime = currentState.selectedTime;
    if (currentState.selectedTime && currentState.selectedTimeZone) {
      if (zone.timeZone === TimeZones.Local) {
        convertedTime = convertTimeToTimeZone(
          currentState.selectedTime,
          TimeZones.LosAngeles,
          TimeZones.Local
        );
      } else if (zone.timeZone === TimeZones.LosAngeles) {
        convertedTime = convertTimeToTimeZone(
          currentState.selectedTime,
          TimeZones.Local,
          TimeZones.LosAngeles
        );
      }
    }

    set({
      selectedTimeZone: zone,
      selectedTime: convertedTime
    });


    if (convertedTime) {
      await AsyncStorage.setItem(STORAGE_TIME_KEY, convertedTime);
    }
  },

  setSelectedTime: async (time: string) => {
    await AsyncStorage.setItem(STORAGE_TIME_KEY, time);
    set({ selectedTime: time });
  },

  resetDates: async () => {
    await AsyncStorage.removeItem(STORAGE_TIME_KEY);
    await AsyncStorage.removeItem(STORAGE_TIME_ZONE_KEY);
    set({ selectedTimeZone: TIME_ZONES[1], selectedTime: undefined });
  },

  fetchTimes: async () => {
    const zone = await AsyncStorage.getItem(STORAGE_TIME_ZONE_KEY);
    const time = await AsyncStorage.getItem(STORAGE_TIME_KEY);

    set({
      selectedTimeZone: zone ? JSON.parse(zone) : TIME_ZONES[0],
      selectedTime: time || undefined,
    });
  },
}));