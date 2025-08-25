// src/store/useAuthStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import Toast from 'react-native-toast-message';
import { createUser, verifyUser, User } from '../api/AuthAPI';
import { onGoogleButtonPress } from '../api/Firebase';

const PATTERN = 100;
const STORAGE_TOKEN_KEY = '@per_diem/auth_token';
const STORAGE_USER_KEY = '@per_diem/auth_user';

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;

  restoreSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: true,

  restoreSession: async () => {
    try {
      const savedToken = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
      const savedUserJSON = await AsyncStorage.getItem(STORAGE_USER_KEY);

      if (savedToken && savedUserJSON) {
        set({
          token: savedToken,
          user: JSON.parse(savedUserJSON),
        });
      }
    } catch {
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
      await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      const { token } = await createUser({ email, password });
      const profile = await verifyUser(token);

      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));

      set({ token, user: profile });
      Vibration.vibrate(PATTERN);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error Signing In',
        text2: 'We could not locate this profile.',
      });
      console.error(error);
    }
  },

  signInWithGoogle: async () => {
    try {
      const { profile, idToken } = await onGoogleButtonPress();
      if (idToken && profile) {
        await AsyncStorage.setItem(STORAGE_TOKEN_KEY, idToken);
        await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));

        set({ token: idToken, user: profile });
        Vibration.vibrate(PATTERN);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error Signing In',
        text2: 'Google login failed, try again.',
      });
      console.error(error);
    }
  },

  signOut: async () => {
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    await AsyncStorage.removeItem(STORAGE_USER_KEY);
    Vibration.vibrate(PATTERN);
    set({ token: null, user: null });
  },
}));
