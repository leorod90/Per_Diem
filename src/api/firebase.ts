// import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FIREBASE_GOOGLE_ID } from "@env";
import { User } from './AuthAPI';

GoogleSignin.configure({
  webClientId: FIREBASE_GOOGLE_ID
});

export interface GoogleSignInResult {
  profile: User | null;
  idToken: string | null;
}

export const onGoogleButtonPress = async (): Promise<GoogleSignInResult> => {
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    // Try the new style of google-sign in result, from v13+ of that module
    const { idToken, user } = signInResult?.data;

    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }
    return {
      profile: user,
      idToken
    }
    // //  Create a Google credential with the token - USE THE idToken VARIABLE
    // const googleCredential = GoogleAuthProvider.credential(idToken);

    // // Sign-in the user with the credential
    // return signInWithCredential(getAuth(), googleCredential);
  } catch (error) {
    console.log(error)
    return {
      profile: null,
      idToken: null
    }
  }
}
