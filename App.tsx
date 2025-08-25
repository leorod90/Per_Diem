import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen/HomeScreen";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from "react-native-toast-message";
import Header from "./src/components/Header/Header";
import themes from "./src/themes";
import { useAuthStore } from "./src/store/useAuthStore";
import TimeScreen from "./src/screens/TimeScreen/TimeScreen";
import { RootStackParamList } from "./src/types/DefaultScreenType";
import { useTimeStore } from "./src/store/useTimeStore";
import { useNotification } from "./src/notifications/useNotifications";

enableScreens();

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user, token, loading, restoreSession } = useAuthStore();
  const { fetchTimes } = useTimeStore();

  useEffect(() => {
    // if (loading) {
    //   // todo: splashcreen
    // }
    restoreSession();
    fetchTimes();
  }, [restoreSession, fetchTimes]);

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: themes.colors.backgroundColor },
        // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      {(user && token) ? (
        <>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ header: () => <Header /> }}
          />
          <Stack.Screen
            name="TimeScreen"
            component={TimeScreen}
            options={{
              presentation: "modal",
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}

        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <>
          <RootNavigator />
          <Toast />
        </>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

