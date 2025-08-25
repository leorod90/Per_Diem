import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '../../components/CustomText'
import { getStoreTimes } from '../../api/StoreTimeAPI'
import { getStoreOverrides } from '../../api/StoreOverrides'
import { convertTimeToTimeZone, getCityFromTimeZone, TIME_ZONES, TimeZones, TimeZoneType } from '../../utils/Dates'
import themes, { spacing } from '../../themes'
import TimeDisplay, { CardFadeDirection } from './TimeDisplay'
import { TimePickerModal } from '../../components/TimePickerModal'

export default function HomeScreen() {
  const [selectedTimeZone, setSelectedTimeZone] = useState(TIME_ZONES[0]);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showTimeModal, setShowTimeModal] = useState(false);

  useEffect(() => {
    if (!selectedTime || !selectedTimeZone) return;

    let convertedTime: string | null = null;

    if (selectedTimeZone.timeZone === TimeZones.Local) {
      convertedTime = convertTimeToTimeZone(selectedTime, TimeZones.LosAngeles, TimeZones.Local);
    } else if (selectedTimeZone.timeZone === TimeZones.LosAngeles) {
      convertedTime = convertTimeToTimeZone(selectedTime, TimeZones.Local, TimeZones.LosAngeles);
    }

    if (convertedTime) {
      console.log(convertedTime)
      // setConvertedTime(convertedTime); 
    }

  }, [selectedTimeZone]);

  const getStoreTimesHandler = async () => {
    const data = await getStoreTimes();
    const data2 = await getStoreOverrides();
    // console.log("store times", data);
    // console.log("store override", data2)
  }

  const selectTimeZone = (tZ: TimeZoneType) => {
    setSelectedTimeZone(tZ)
  }

  const setTimeHandler = (time) => {
    setSelectedTime(time);
    setShowTimeModal(false);
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
          setShowTimeModal={setShowTimeModal}
        />
      )}
      {selectedTimeZone.timeZone === TimeZones.LosAngeles && (
        <TimeDisplay
          key={TimeZones.LosAngeles}
          timeZoneItem={selectedTimeZone}
          fadeDirection={CardFadeDirection.RIGHT}
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