import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generateNext30Days, NextDays, TimeZoneType } from '../../utils/Dates'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import themes, { spacing } from '../../themes';
import CustomHeading from '../../components/CustomHeading';
import CustomText from '../../components/CustomText';
import { useTimeStore } from '../../store/useTimeStore';

const FLAT_DELAY = 25;

export enum CardFadeDirection {
  LEFT,
  RIGHT
}
interface TimeProps {
  item: NextDays;
  index: number;
  fadeDirection: CardFadeDirection;
  setShowTimeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTempDate: React.Dispatch<React.SetStateAction<NextDays | undefined>>;
}

const TimeCard = ({ item, index, fadeDirection, setShowTimeModal, setTempDate }: TimeProps) => (
  <Animated.View
    style={styles.card}
    entering={
      fadeDirection === CardFadeDirection.LEFT ?
        FadeInLeft.springify().delay(index * FLAT_DELAY) :
        FadeInRight.springify().delay(index * FLAT_DELAY)
    }>
    <TouchableOpacity
      style={styles.cardInner}
      onPress={() => {
        setShowTimeModal(true);
        setTempDate(item);
      }}
    >
      <CustomText size={themes.text.md}>{item.month}</CustomText>
      <CustomHeading>{item.day}</CustomHeading>
    </TouchableOpacity>
  </Animated.View>
)

interface Props {
  fadeDirection?: CardFadeDirection;
  setShowTimeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTempDate: React.Dispatch<React.SetStateAction<NextDays | undefined>>;
}

export default function TimeDisplay({
  fadeDirection = CardFadeDirection.LEFT,
  setShowTimeModal,
  setTempDate
}: Props) {
  const [next30Array, setNext30Array] = useState<NextDays[]>([])
  const safeAreaInsets = useSafeAreaInsets();
  const { selectedTimeZone } = useTimeStore();

  useEffect(() => {
    const next30 = generateNext30Days(selectedTimeZone.timeZone);
    setNext30Array(next30);
  }, [selectedTimeZone])

  return (
    <FlatList
      data={next30Array}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom
      }}
      renderItem={({ item, index }) => (
        <TimeCard
          item={item}
          index={index}
          fadeDirection={fadeDirection}
          setShowTimeModal={setShowTimeModal}
          setTempDate={setTempDate}
        />
      )}
      columnWrapperStyle={styles.row}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    marginBottom: spacing(12),
  },
  card: {
    flex: 1,
    marginHorizontal: spacing(4),
    backgroundColor: themes.colors.white,
    borderRadius: spacing(12),
    shadowColor: themes.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardInner: {
    flex: 1,
    alignItems: "center",
    padding: spacing(12),
  }
});