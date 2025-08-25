// hooks/useNotification.ts
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

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

  // Function to test notification
  const testNotification = async () => {
    try {
      await createAndroidChannel();

      await notifee.displayNotification({
        title: 'Test Notification',
        body: 'This is a test notification!',
        android: {
          channelId: 'default',
        },
        ios: {
          sound: 'default',
        },
      });

      console.log('Notification triggered');
    } catch (err) {
      console.error('Error displaying notification:', err);
    }
  };

  // Request permission on mount automatically
  useEffect(() => {
    requestPermission();
  }, []);

  return { requestPermission, testNotification };
}
