import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { formatToAmPm } from '../../utils/Dates'

interface Props {
  selectedTime: string
}

export default function DisplayStore({selectedTime}:Props) {
  return (
    <View>
      <Text>{formatToAmPm(selectedTime)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})