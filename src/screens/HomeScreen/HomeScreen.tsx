import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '../../components/CustomText'
import themes, { spacing } from '../../themes'
import { useTimeStore } from '../../store/useTimeStore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../types/DefaultScreenType'
import CustomHeading from '../../components/CustomHeading'
import { format, toZonedTime } from 'date-fns-tz'
import { formatToAmPm, getCityFromTimeZone, getGreeting, TIME_ZONES, TimeZones } from '../../utils/Dates'
import { getStoreTimes } from '../../api/StoreTimeAPI'
import { getStoreOverrides } from '../../api/StoreOverrides'
import { StoreOverride, StoreTime } from '../../types/StoreTypes'
import { StoreComponent } from './StoreComponent'
import Animated, { FadeInDown } from 'react-native-reanimated'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();
  const { selectedTimeZone, selectedTime, setSelectedTimeZone } = useTimeStore();
  const [greetingText, setGreetingText] = useState("");
  const [storeTimes, setStoreTimes] = useState<StoreTime[]>([]);
  const [storeOverrideTimes, setStoreOverrideTimes] = useState<StoreOverride[]>([]);

  useEffect(() => {
    const now = new Date();
    const zonedDate = toZonedTime(now, selectedTimeZone.timeZone);
    const hour = Number(format(zonedDate, "HH"));
    const greeting = getGreeting(hour);
    setGreetingText(greeting);
  }, [selectedTimeZone])

  useEffect(() => {
    getStoreTimesHandler();
  }, [])


  const getStoreTimesHandler = async () => {
    const storeT = await getStoreTimes();
    const storeOverrideT = await getStoreOverrides();
    console.log(storeT)
    setStoreTimes(storeT);
    setStoreOverrideTimes(storeOverrideT);
  }

  const navToTimeScreen = () => {
    navigation.navigate("TimeScreen");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <CustomHeading>{greetingText}</CustomHeading>
        <Animated.View
          key={selectedTimeZone.label}
          entering={FadeInDown}
        >
          <CustomHeading>{selectedTimeZone.label}!</CustomHeading>
        </Animated.View>
      </View>
      <CustomText size={themes.text.sm}>We are proud to announce our new Perdiem store! We have stores open
        in {TIME_ZONES[0].label} and {TIME_ZONES[1].label}. Check out our store hours.
      </CustomText>
      <View style={styles.timeZoneContainer}>
        {TIME_ZONES.map((item) => (
          <TouchableOpacity
            key={item.timeZone}
            onPress={() => setSelectedTimeZone(item)}
            style={[
              styles.timeZoneItem,
              {
                opacity: selectedTimeZone.timeZone === item.timeZone ? 1 : .4
              }
            ]}
          >
            <CustomText>{getCityFromTimeZone(item.timeZone)}</CustomText>
          </TouchableOpacity>
        ))}
      </View>
      <StoreComponent storeTimes={storeTimes} />
      <CustomText size={themes.text.sm}>You can also check future times below!</CustomText>
      <CustomText>{formatToAmPm(selectedTime)}</CustomText>
      <TouchableOpacity onPress={navToTimeScreen}><CustomText>Check a Date</CustomText></TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: themes.sizing.defaultPadding,
    gap: spacing(8),
  },
  timeZoneContainer: {
    flexDirection: "row",
    gap: spacing(2),
  },
  timeZoneItem: {
    paddingRight: spacing(10)
  }
})