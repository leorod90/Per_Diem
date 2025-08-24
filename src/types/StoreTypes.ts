export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum Month {
  JANUARY = 1,
  FEBRUARY = 2,
  MARCH = 3,
  APRIL = 4,
  MAY = 5,
  JUNE = 6,
  JULY = 7,
  AUGUST = 8,
  SEPTEMBER = 9,
  OCTOBER = 10,
  NOVEMBER = 11,
  DECEMBER = 12
}

// "start_time": "22:42",
// "end_time": "10:10"

export interface PostStoreTime {
  day_of_week: DayOfWeek;
  is_open: boolean;
  start_time: string;
  end_time: string;
}

export interface StoreTime extends PostStoreTime {
  id: string;
}

export interface PostStoreOverride {
  day: DayOfWeek;      
  month: Month;
  is_open: boolean;
  start_time: string;
  end_time: string;
}

export interface StoreOverride extends PostStoreOverride {
  id: string;
}
