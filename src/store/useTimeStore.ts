// store/timeStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkIfOpenOnDate, convertTimeToTimeZone, NextDays, TIME_ZONES, TimeZones, TimeZoneType } from "../utils/Dates";

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

    // Save the selected timezone
    await AsyncStorage.setItem(STORAGE_TIME_ZONE_KEY, JSON.stringify(zone));

    // Convert time if needed
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

    // Update state
    set({
      selectedTimeZone: zone,
      selectedTime: convertedTime,
    });

    // Save converted time
    if (convertedTime) {
      await AsyncStorage.setItem(STORAGE_TIME_KEY, convertedTime);
    }

    const { selectedDate } = currentState;

    if (convertedTime && selectedDate) {
      const isStoreOpen = await checkIfOpenOnDate(convertedTime, selectedDate);
      const newSelectedDate = { ...selectedDate, isStoreOpen };

      await AsyncStorage.setItem(STORAGE_TIME_DATE, JSON.stringify(newSelectedDate));

      set({
        selectedDate: newSelectedDate,
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
function setSelectedDate(arg0: any) {
  throw new Error("Function not implemented.");
}

