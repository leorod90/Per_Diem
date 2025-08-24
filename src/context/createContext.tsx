// src/context/AuthContext.tsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, verifyUser, User } from '../api/AuthAPI';
import { Vibration } from 'react-native';
import Toast from 'react-native-toast-message';
import { onGoogleButtonPress } from '../api/Firebase';

const PATTERN = 100;
const STORAGE_TOKEN_KEY = '@per_diem/auth_token';
const STORAGE_USER_KEY = '@per_diem/auth_user';

type AuthState = { token: string | null; user: User | null; loading: boolean };
type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  token: null, user: null, loading: true,
  signIn: async () => { },
  signInWithGoogle: async () => { },
  signOut: async () => { }
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const savedToken = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
      const savedUserJSON = await AsyncStorage.getItem(STORAGE_USER_KEY);
      if (savedToken && savedUserJSON) {
        setToken(savedToken);
        const savedUser = JSON.parse(savedUserJSON);
        setUser(savedUser);
      }
    } catch {
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
      await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { token } = await createUser({ email, password });
      const profile = await verifyUser(token);
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));

      setToken(token);
      setUser(profile);
      Vibration.vibrate(PATTERN);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error Signing In",
        text2: "We could not locate this profile."
      });
      console.log(error)
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { profile, idToken } = await onGoogleButtonPress();
      if (idToken && profile) {
        await AsyncStorage.setItem(STORAGE_TOKEN_KEY, idToken);
        await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
        setToken(idToken);
        setUser(profile);
        Vibration.vibrate(PATTERN);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error Signing In",
        text2: "Google login failed, try again."
      });
      console.log(error)
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    await AsyncStorage.removeItem(STORAGE_USER_KEY);
    Vibration.vibrate(PATTERN);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    token, user, loading, signIn, signInWithGoogle, signOut
  }), [token, user, loading, signIn, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
