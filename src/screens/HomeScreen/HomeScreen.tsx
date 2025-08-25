import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '../../components/CustomText'
import { getStoreTimes } from '../../api/StoreTimeAPI'
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated'
import { getStoreOverrides } from '../../api/StoreOverrides'
import { getCityFromTimeZone, TIME_ZONES, TimeZones, TimeZoneType } from '../../utils/Dates'
import themes, { spacing } from '../../themes'
import TimeDisplay, { CardFadeDirection } from './TimeDisplay'

export default function HomeScreen() {
  const [selectedTimeZone, setSelectedTimeZone] = useState(TIME_ZONES[0]);

  useEffect(() => {
    // const c = getCityFromTimeZone(TIME_ZONES.current);
    // setCity(c);
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // getStoreTimesHandler();
    // const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // console.log(localTimezone)
  }, [])

  const getStoreTimesHandler = async () => {
    const data = await getStoreTimes();
    const data2 = await getStoreOverrides();
    // console.log("store times", data);
    // console.log("store override", data2)
  }

  const selectTimeZone = (tZ: TimeZoneType) => {
    setSelectedTimeZone(tZ)
  }

  return (
    <View style={styles.container}>
      <View style={styles.timeZoneContainer}>
        {TIME_ZONES.map((item) => (
          <TouchableOpacity
            key={item.timeZone}
            onPress={() => selectTimeZone(item)}
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
      {selectedTimeZone.timeZone === TimeZones.Local && (
        <TimeDisplay
          key={TimeZones.Local}
          timeZoneItem={selectedTimeZone}
        />
      )}
      {selectedTimeZone.timeZone === TimeZones.LosAngeles && (
        <TimeDisplay
          key={TimeZones.LosAngeles}
          timeZoneItem={selectedTimeZone}
          fadeDirection={CardFadeDirection.RIGHT}
        />
      )}
      {/* <Animated.View
        entering={FadeInDown}>
        <CustomText>{city}</CustomText>
      </Animated.View> */}
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