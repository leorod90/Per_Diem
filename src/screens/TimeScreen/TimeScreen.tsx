import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '../../components/CustomText'
import { getCityFromTimeZone, NextDays, roundToNearest15, TIME_ZONES, TimeZones } from '../../utils/Dates'
import themes, { spacing } from '../../themes'
import TimeDisplay, { CardFadeDirection } from './TimeDisplay'
import { TimePickerModal } from '../../components/TimePickerModal'
import { useTimeStore } from '../../store/useTimeStore'
import { RootStackParamList } from '../../types/DefaultScreenType'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

type TimeScreenNavProp = StackNavigationProp<RootStackParamList, "TimeScreen">;

export default function TimeScreen() {
  const navigation = useNavigation<TimeScreenNavProp>();

  const { fetchTimes, selectedTimeZone, setSelectedTime, setSelectedTimeZone, setSelectedDate } = useTimeStore();
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempDate, setTempDate] = useState<NextDays>()

  useEffect(() => {
    fetchTimes();
  }, [fetchTimes]);

  const setTimeHandler = (time: string) => {
    if (!tempDate) {
      return
    }
    const roundedTime = roundToNearest15(time);
    setSelectedTime(roundedTime);
    setSelectedDate(tempDate)
    setShowTimeModal(false);
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeZoneContainer}>
        {TIME_ZONES.map((item) => (
          <TouchableOpacity
            key={item.timeZone}
            onPress={() => setSelectedTimeZone(item)}
            style={[
              styles.timeZoneItem,
              {
                opacity: selectedTimeZone.timeZone === item.timeZone ? 1 : .4,
                borderBottomWidth: 2,
                borderColor: selectedTimeZone.timeZone === item.timeZone ? themes.colors.primary : "transparent",
              }
            ]}
          >
            <CustomText>{getCityFromTimeZone(item.timeZone)}</CustomText>
          </TouchableOpacity>
        ))}
      </View>
      {selectedTimeZone.timeZone === TimeZones.Local && (
        <TimeDisplay
          key={TimeZones.Local}
          setShowTimeModal={setShowTimeModal}
          setTempDate={setTempDate}
          fadeDirection={CardFadeDirection.RIGHT}
        />
      )}
      {selectedTimeZone.timeZone === TimeZones.LosAngeles && (
        <TimeDisplay
          key={TimeZones.LosAngeles}
          setTempDate={setTempDate}
          setShowTimeModal={setShowTimeModal}
        />
      )}
      <TimePickerModal
        visible={showTimeModal}
        onCancel={() => setShowTimeModal(false)}
        onConfirm={setTimeHandler}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: themes.sizing.defaultPadding
  },
  timeZoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    gap: spacing(8),
    marginBottom: spacing(20),
  },
  timeZoneItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
  }
})