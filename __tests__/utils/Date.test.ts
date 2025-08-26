import {
  generateNext30Days,
  generateTimeSlots,
  formatToAmPm,
  getCityFromTimeZone,
  convertTimeToTimeZone,
  getGreeting,
  roundToNearest30,
  getDayName,
  checkIfOpenOnDate
} from '../../src/utils/Dates';
import { DayOfWeek } from '../../src/types/StoreTypes';

// Mock the API calls
jest.mock('../../src/api/StoreTimeAPI');
jest.mock('../../src/api/StoreOverrides');

describe('Date Utils', () => {
  describe('generateTimeSlots', () => {
    it('generates time slots with default 15 minute intervals', () => {
      const slots = generateTimeSlots();
      expect(slots[0]).toBe('00:00');
      expect(slots[1]).toBe('00:15');
      expect(slots[4]).toBe('01:00');
      expect(slots.length).toBe(96); // 24 hours * 4 slots per hour
    });

    it('generates time slots with custom intervals', () => {
      const slots = generateTimeSlots(30);
      expect(slots[0]).toBe('00:00');
      expect(slots[1]).toBe('00:30');
      expect(slots[2]).toBe('01:00');
      expect(slots.length).toBe(48); // 24 hours * 2 slots per hour
    });
  });

  describe('formatToAmPm', () => {
    it('converts 24-hour format to AM/PM format', () => {
      expect(formatToAmPm('09:30')).toBe('9:30 AM');
      expect(formatToAmPm('13:45')).toBe('1:45 PM');
      expect(formatToAmPm('00:00')).toBe('12:00 AM');
      expect(formatToAmPm('12:00')).toBe('12:00 PM');
      expect(formatToAmPm('23:59')).toBe('11:59 PM');
    });

    it('handles undefined input', () => {
      expect(formatToAmPm(undefined)).toBe(null);
    });

    it('handles invalid input', () => {
      expect(formatToAmPm('invalid')).toBe(null);
    });
  });

  describe('getCityFromTimeZone', () => {
    it('extracts city name from timezone string', () => {
      expect(getCityFromTimeZone('America/New_York')).toBe('New York');
      expect(getCityFromTimeZone('America/Los_Angeles')).toBe('Los Angeles');
      expect(getCityFromTimeZone('Europe/London')).toBe('London');
    });
  });

  describe('getGreeting', () => {
    it('returns correct greeting based on hour', () => {
      expect(getGreeting(7)).toBe('Good Morning,');
      expect(getGreeting(10)).toBe('Late Morning Vibes');
      expect(getGreeting(14)).toBe('Good Afternoon,');
      expect(getGreeting(19)).toBe('Good Evening!');
      expect(getGreeting(23)).toBe('Night Owl in');
    });
  });

  describe('roundToNearest30', () => {
    it('rounds time to nearest 30 minutes', () => {
      expect(roundToNearest30('14:15')).toBe('14:30');
      expect(roundToNearest30('14:45')).toBe('15:00');
      expect(roundToNearest30('14:00')).toBe('14:00');
      expect(roundToNearest30('14:30')).toBe('14:30');
      expect(roundToNearest30('23:45')).toBe('00:00');
    });
  });

  describe('getDayName', () => {
    it('returns correct day abbreviation', () => {
      expect(getDayName(DayOfWeek.MONDAY)).toBe('Mon');
      expect(getDayName(DayOfWeek.FRIDAY)).toBe('Fri');
      expect(getDayName(DayOfWeek.SUNDAY)).toBe('Sun');
    });
  });

  describe('generateNext30Days', () => {
    it('generates 30 days of date objects', () => {
      const dates = generateNext30Days('America/New_York');
      expect(dates).toHaveLength(30);
      expect(dates[0]).toHaveProperty('month');
      expect(dates[0]).toHaveProperty('day');
      expect(dates[0]).toHaveProperty('year');
      expect(dates[0]).toHaveProperty('dayName');
      expect(dates[0]).toHaveProperty('dayNum');
      expect(dates[0]).toHaveProperty('monthNum');
    });
  });

  describe('convertTimeToTimeZone', () => {
    it('converts time between timezones', () => {
      const result = convertTimeToTimeZone(
        '14:30',
        'America/New_York',
        'America/Los_Angeles'
      );
      
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('day');
      expect(result).toHaveProperty('month');
      expect(result).toHaveProperty('year');
    });
  });
});