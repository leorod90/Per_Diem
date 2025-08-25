import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { formatToAmPm, getGreeting, TimeZones } from '../../utils/Dates'
import { useTimeStore } from '../../store/useTimeStore';
import { format, toZonedTime } from 'date-fns-tz';
import CustomText from '../../components/CustomText';
import CustomHeading from '../../components/CustomHeading';

interface Props {

}

export default function DisplayStore({ }: Props) {
  const { fetchTimes, selectedTimeZone, selectedTime, setSelectedTime, setSelectedTimeZone } = useTimeStore();
  const [greetingText, setGreetingText] = useState("")

  useEffect(() => {
    const now = new Date();
    const zonedDate = toZonedTime(now, selectedTimeZone.timeZone);
    const hour = Number(format(zonedDate, "HH"));
    const city = selectedTimeZone.label;

    const greeting = getGreeting(hour, city);
    setGreetingText(greeting);
  }, [selectedTimeZone])

  return (
    <View>
      <CustomHeading>{greetingText}</CustomHeading>

      <CustomText>{formatToAmPm(selectedTime)}</CustomText>
    </View>
  )
}

const styles = StyleSheet.create({})