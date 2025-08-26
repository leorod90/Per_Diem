import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import themes from '../themes'

interface Props {
  isOpen: boolean;
}

export default function OpenLight({ isOpen }: Props) {
  return (
    <View
      style={[
        styles.statusCircle,
        { backgroundColor: isOpen ? themes.colors.accent : themes.colors.danger },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
})