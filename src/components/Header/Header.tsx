import { Pressable, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../../context/createContext';
import CustomText from '../CustomText';
import themes, { spacing } from '../../themes';
import CustomBtn from '../CustomBtn';

export default function Header() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeStyle}>
      <CustomText>Welcome, {user?.name}</CustomText>
      <CustomBtn
        text='Logout'
        onPress={signOut}
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