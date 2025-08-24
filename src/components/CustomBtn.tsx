import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import themes, { spacing } from '../themes';
import CustomText from './CustomText';

interface Props {
  bgColor?: string;
  txtColor?: string;
  size?: number;
  onPress: any;
  text: string;
}

export default function CustomBtn({
  bgColor = themes.colors.black,
  txtColor = themes.colors.white,
  onPress,
  text
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? .7 : 1,
          backgroundColor: bgColor
        },
        styles.btn,
      ]}>

      <CustomText color={txtColor}>{text}</CustomText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: spacing(6),
    paddingHorizontal: spacing(10),
    alignItems:'center'
  }
})