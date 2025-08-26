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
    const dayData = storeTimes.find(d => d.day_of_week === dayIndex);

    const isOpen = dayData?.is_open ?? false;
    const start = formatToAmPm(dayData?.start_time) ?? "--:--";
    const end = formatToAmPm(dayData?.end_time) ?? "--:--";

    return (
      <Animated.View entering={FadeIn} style={styles.row} key={dayIndex}>
        <CustomHeading size={themes.text.sm} style={styles.dayLabel}>{getDayName(dayIndex)}</CustomHeading>
        <CustomText size={themes.text.sm} style={styles.timeText} color={themes.colors.grayDark}>{isOpen ? `${start} - ${end}` : "Closed"}</CustomText>
        <OpenLight isOpen={isOpen}/>
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
