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
import { checkIfOpenOnDate, formatToAmPm, getCityFromTimeZone, getGreeting, isDateTimeClosedOverride, NextDays, TIME_ZONES, TimeZones } from '../../utils/Dates'
import { getStoreTimes } from '../../api/StoreTimeAPI'
import { getStoreOverrides } from '../../api/StoreOverrides'
import { StoreOverride, StoreTime } from '../../types/StoreTypes'
import { StoreComponent } from './StoreComponent'
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated'
import CustomBtn from '../../components/CustomBtn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import OpenLight from '../../components/OpenLight'
import { useNotification } from '../../notifications/useNotifications'
import BellIcon from '../../../assets/svg/notification'
import Toast from 'react-native-toast-message'

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavProp>();
  const safeAreaInsets = useSafeAreaInsets();
  const { selectedTimeZone, selectedTime, setSelectedTimeZone, selectedDate } = useTimeStore();
  const { scheduleStoreReminder, testNotification } = useNotification();

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
    setStoreTimes(storeT);
    setStoreOverrideTimes(storeOverrideT);
  }

  const notificationHandler = async () => {
    await testNotification();
    Toast.show({
      type: 'success',
      text1: 'Notification Set',
      text2: 'We will remind you when we are about to open!',
    });
    // await scheduleStoreReminder(storeTimes);
  }

  const navToTimeScreen = () => {
    navigation.navigate("TimeScreen");
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, {
      paddingBottom: safeAreaInsets.bottom
    }]}>
      <View>
        <Animated.View
          key={greetingText}
          entering={FadeInRight}
        >
          <CustomHeading>{greetingText}</CustomHeading>
        </Animated.View>
        <Animated.View
          key={selectedTimeZone.label}
          entering={FadeInDown}
        >
          <CustomHeading color={themes.colors.primary}>{selectedTimeZone.label}!</CustomHeading>
        </Animated.View>
      </View>
      <CustomText size={themes.text.sm}>We are proud to announce our new Perdiem store! We have stores open
        in {TIME_ZONES[0].label} and {TIME_ZONES[1].label}. Check out our store hours.
      </CustomText>
      <View style={styles.tabsAndNotifyWrapper}>
        <View style={styles.timeZoneContainer}>
          {TIME_ZONES.map((item) => (
            <TouchableOpacity
              key={item.timeZone}
              onPress={() => {
                if (selectedTimeZone.timeZone === item.timeZone) return;
                setSelectedTimeZone(item)
              }}
              disabled={selectedTimeZone.timeZone === item.timeZone}
              style={[
                styles.timeZoneItem,
                {
                  opacity: selectedTimeZone.timeZone === item.timeZone ? 1 : .4,
                  borderBottomWidth: 1,
                  borderColor: selectedTimeZone.timeZone === item.timeZone ? themes.colors.primary : "transparent",
                }
              ]}
            >
              <CustomText>{getCityFromTimeZone(item.timeZone)}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
        <BellIcon onPress={notificationHandler} />
      </View>
      <StoreComponent storeTimes={storeTimes} />
      <CustomText size={themes.text.sm}>You can also check future times below!</CustomText>
      {selectedTime && selectedDate?.year ? (
        <>
          <CustomText size={themes.text.sm}>{selectedDate.dayName}, {selectedDate?.month} {selectedDate?.day} {formatToAmPm(selectedTime)}</CustomText>
          <View style={styles.openRow}>
            <CustomText size={themes.text.sm}>We are {selectedDate.isStoreOpen ? "Open" : "Closed"}</CustomText>
            <OpenLight isOpen={selectedDate.isStoreOpen!} />
          </View>
        </>
      ) : (
        <CustomText color={themes.colors.grayDark} size={themes.text.xs}>Please Select a Date</CustomText>
      )}

      <View style={{ flex: 1 }} />
      <CustomBtn
        onPress={navToTimeScreen}
        text='Check a Date'
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: themes.sizing.defaultPadding,
    gap: spacing(8),
  },
  tabsAndNotifyWrapper: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing(16),
  },
  timeZoneContainer: {
    flexDirection: "row",
    gap: spacing(2),
  },
  timeZoneItem: {
    marginRight: spacing(10)
  },
  openRow: {
    gap: spacing(6),
    flexDirection: 'row',
    alignItems: 'center'
  }
})
