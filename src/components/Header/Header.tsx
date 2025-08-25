import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomText from '../CustomText';
import themes from '../../themes';
import CustomBtn from '../CustomBtn';
import { useAuthStore } from '../../store/useAuthStore';
import { useTimeStore } from '../../store/useTimeStore';

export default function Header() {
  const { user, signOut } = useAuthStore();
  const { resetDates } = useTimeStore();

  const signOutHandler = () => {
    signOut();
    resetDates();
  }

  return (
    <SafeAreaView style={styles.safeStyle}>
      <CustomText>Welcome, {user?.name}</CustomText>
      <CustomBtn
        text='Logout'
        onPress={signOutHandler}
        bgColor={themes.colors.danger}
        txtColor={themes.colors.white}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: themes.sizing.defaultPadding
  }
})