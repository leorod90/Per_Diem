import { NewAppScreen } from '@react-native/new-app-screen';
import { Alert, Button, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';


function App() {
  const isDarkMode = useColorScheme() === 'dark';


  useEffect(() => {
GoogleSignin.configure({
  webClientId: '564532712183-ao0pf6poqqaaf0u1ckpfaddo12bpntne.apps.googleusercontent.com',
});
    console.log('connected');
  }, [])


  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      const { idToken, user } = signInResult?.data;
      console.log( idToken)
            console.log( user )

      if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
      }
      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token - USE THE idToken VARIABLE
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return signInWithCredential(getAuth(), googleCredential);
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title='google' onPress={onGoogleButtonPress} />
      </View>
    </SafeAreaProvider>
  );
}

export default App;
