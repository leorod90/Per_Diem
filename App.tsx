import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
// import HomeScreen from "./src/screens/HomeScreen";
// import LoginScreen from "./src/screens/LoginScreen";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { getStoreTimes } from "./src/api/StoreTimeAPI";
// import { AuthContext, AuthProvider } from "./src/context/createContext";
// import Toast from "react-native-toast-message";
// import Header from "./src/components/Header/Header";
// import themes from "./src/themes";

enableScreens();

const Stack = createStackNavigator();

function RootNavigator() {
  // const { user, loading, token } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!loading) {
  //     // TODO: hide splashscreen
  //   }
  // }, [loading])

  return (
    <Stack.Navigator
      screenOptions={{
        // cardStyle: { backgroundColor: themes.colors.backgroundColor },
        // cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      {/* {(user && token) ? (
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ header: () => <Header /> }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}

        />
      )} */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {/* <AuthProvider> */}
          <>
            <RootNavigator />
            {/* <Toast /> */}
          </>
        {/* </AuthProvider> */}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

