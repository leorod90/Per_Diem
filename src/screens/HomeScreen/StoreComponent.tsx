import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import themes, { spacing } from "../../themes";
import CustomText from "../../components/CustomText";
import CustomHeading from "../../components/CustomHeading";
import { formatToAmPm, getDayName } from "../../utils/Dates";
import { DayOfWeek } from "../../types/StoreTypes";
import OpenLight from "../../components/OpenLight";

interface StoreTime {
  day_of_week?: number;
  start_time?: string;
  end_time?: string;
  is_open?: boolean;
  id: string;
}

interface Props {
  storeTimes: StoreTime[];
}

export const StoreComponent: React.FC<Props> = ({ storeTimes }) => {
  const renderDay = (dayIndex: number) => {
    const dayEntries = storeTimes.filter(d => d.day_of_week === dayIndex);

    if (dayEntries.length === 0) return null;

    const isOpen = dayEntries.some(d => d.is_open);

    // Combine start-end times for all open periods
    const times = dayEntries
      .filter(d => d.is_open)
      .map(d => `${formatToAmPm(d.start_time)} - ${formatToAmPm(d.end_time)}`)
      .join(", ") || "Closed";

    return (
      <Animated.View entering={FadeIn} style={styles.row} key={dayIndex}>
        <CustomHeading size={themes.text.sm} style={styles.dayLabel}>
          {getDayName(dayIndex)}
        </CustomHeading>
        <CustomText size={themes.text.sm} style={styles.timeText} color={themes.colors.grayDark}>
          {times}
        </CustomText>
        <OpenLight isOpen={isOpen} />
      </Animated.View>
    );
  };

  return <View style={styles.container}>{[1, 2, 3, 4, 5, 6, 7].map(renderDay)}</View>;
};


const styles = StyleSheet.create({
  container: {
    padding: spacing(16),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing(12),
  },
  dayLabel: {
    flex: 1,
  },
  timeText: {
    flex: 2,
  },

});
