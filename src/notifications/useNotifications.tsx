// hooks/useNotification.ts
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { addDays, format, isAfter, isBefore, set, subHours, subMinutes } from 'date-fns';
import { StoreTime } from '../types/StoreTypes';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';
import { TimeZones } from '../utils/Dates';

const TEST_DELAY =  5000 // 5 seconds;
const  DELAY_BEFORE = 60; // in minutes

export function useNotification() {
  // Request permission for notifications
  const requestPermission = async () => {
    try {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= 1) {
        console.log('Notification permission granted');
      } else {
        Alert.alert('Permission denied', 'Cannot send notifications without permission');
      }
    } catch (err) {
      console.error('Permission request error:', err);
    }
  };

  // Create Android notification channel
  const createAndroidChannel = async () => {
    if (Platform.OS === 'android') {
      try {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
      } catch (err) {
        console.error('Error creating Android channel:', err);
      }
    }
  };

  const testNotification = async () => {
    try {
      await createAndroidChannel();

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + TEST_DELAY,
      };

      await notifee.createTriggerNotification({
        id: 'test-reminder',
        title: 'Test Notification',
        body: 'This is a test notification!',
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      }, trigger);

    } catch (err) {
      console.error('Error scheduling notification:', err);
    }
  };

  const scheduleStoreReminder = async (storeHours: StoreTime[], timezone = TimeZones.Local) => {
    try {
      await createAndroidChannel();

      // Get current time in the specified timezone
      const now = new Date();
      const nowInTimezone = toZonedTime(now, timezone);
      const currentDay = nowInTimezone.getDay() === 0 ? 7 : nowInTimezone.getDay();

      // Filter valid open hours
      const validHours = storeHours.filter(hour =>
        hour.day_of_week &&
        hour.is_open === true &&
        hour.start_time &&
        hour.start_time.trim() !== ''
      );

      let nextOpeningTime = null;

      // Check if store opens later today
      const todaysHours = validHours.find(hour => hour.day_of_week === currentDay);
      if (todaysHours) {
        const [hours, minutes] = todaysHours.start_time.split(':').map(Number);
        const todayOpening = set(nowInTimezone, { hours, minutes, seconds: 0, milliseconds: 0 });

        if (isAfter(todayOpening, nowInTimezone)) {
          nextOpeningTime = todayOpening;
        }
      }

      // If not today, find next opening day
      if (!nextOpeningTime) {
        for (let i = 1; i <= 7; i++) {
          const checkDay = (currentDay + i - 1) % 7 + 1;
          const dayHours = validHours.find(hour => hour.day_of_week === checkDay);

          if (dayHours) {
            const [hours, minutes] = dayHours.start_time.split(':').map(Number);
            nextOpeningTime = set(addDays(nowInTimezone, i), { hours, minutes, seconds: 0, milliseconds: 0 });
            break;
          }
        }
      }

      if (!nextOpeningTime) {
        console.log('No opening hours found');
        return;
      }

      // Schedule notification 1 hour before opening
      // const notificationTime = subHours(nextOpeningTime, 1);
      const notificationTime = subMinutes(nextOpeningTime, DELAY_BEFORE);
      // Don't schedule if notification time is in the past
      if (isBefore(notificationTime, nowInTimezone)) {
        console.log('Notification time would be in the past');
        return;
      }

      // Convert back to UTC for the notification system
      const notificationTimeUTC = fromZonedTime(notificationTime, timezone);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: notificationTimeUTC.getTime(),
      };

      await notifee.createTriggerNotification({
        id: 'store-opening-reminder',
        title: 'Store Opening Soon! 🏪',
        body: `The store opens in 1 hour at ${formatInTimeZone(nextOpeningTime, timezone, 'h:mm a')}`,
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      }, trigger);

      console.log(`Notification scheduled for: ${formatInTimeZone(notificationTime, timezone, 'MMM d, h:mm a')} ${timezone}`);
      console.log(`Store opens at: ${formatInTimeZone(nextOpeningTime, timezone, 'MMM d, h:mm a')} ${timezone}`);

    } catch (err) {
      console.error('Error scheduling store reminder:', err);
    }
  };

  // Request permission on mount automatically
  useEffect(() => {
    requestPermission();
  }, []);

  return { requestPermission, testNotification, scheduleStoreReminder };
}
