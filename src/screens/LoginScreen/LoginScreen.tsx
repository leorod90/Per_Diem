import { View, TextInput, StyleSheet, Pressable, Vibration, Text, Image } from 'react-native'
import React, { useState } from 'react'
import Toast from 'react-native-toast-message';
import CustomText from '../../components/CustomText.tsx';
import themes, { spacing } from '../../themes/index.ts';
import Blob from '../../../assets/svg/pattern.tsx'
import CustomBtn from '../../components/CustomBtn.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeading from '../../components/CustomHeading.tsx';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { RootStackParamList } from '../../types/DefaultScreenType.ts';
import { StackNavigationProp } from '@react-navigation/stack';

const BLOB_SIZE = 400;
const GOOGLE_LOGO_SIZE = 30;

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, "LoginScreen">;

export default function LoginScreen() {
  const [email, setEmail] = useState("user@tryperdiem.com");
  const [password, setPassword] = useState("password");
  const { signIn, signInWithGoogle } = useAuthStore();

  const loginUserHandler = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address."
      });
    }
    if (password.length < 6) {
      return Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2: "Password must be 6 characters or longer."
      });
    }
    signIn(email, password);
  }

  return (
    <View style={styles.container}>
      <View style={styles.blobWrapper}>
        <Blob size={BLOB_SIZE} />
      </View>
      <SafeAreaView style={styles.inputContainer}>
        <CustomHeading>Perdiem</CustomHeading>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />
        <CustomBtn
          onPress={loginUserHandler}
          text='Enter'
        />
        <Pressable
          onPress={signInWithGoogle}
          style={({ pressed }) => [
            styles.googleButton,
            { opacity: pressed ? .7 : 1 }
          ]}
        >
          <View style={styles.googleButtonInner}>
            <Image style={styles.googleImg}
              source={require("../../../assets/imgs/google-logo.jpg")}
            />
            <CustomText color={themes.colors.white}>Sign in with Google</CustomText>
          </View>
        </Pressable>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  blobWrapper: {
    position: 'absolute',
    left: -BLOB_SIZE / 4,
    top: -BLOB_SIZE / 8,
  },
  inputContainer: {
    justifyContent: 'flex-start',
    // backgroundColor:'red',
    zIndex: 100,
    gap: spacing(10),
  },
  input: {
    borderWidth: 1,
    borderColor: themes.colors.gray,
    backgroundColor: themes.colors.white,
    padding: spacing(4),
    borderRadius: spacing(4),
  },
  button: {
  },
  googleButton: {
    backgroundColor: themes.colors.googleBlue
  },
  googleButtonInner: {
    flexDirection: "row",
    alignItems: 'center',
    gap: spacing(8),
    paddingRight: spacing(8),
    padding: spacing(2),
    borderRadius: spacing(2)
  },
  googleImg: {
    height: spacing(GOOGLE_LOGO_SIZE),
    width: spacing(GOOGLE_LOGO_SIZE),
  }
})