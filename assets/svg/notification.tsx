import React from "react";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import themes, { spacing } from "../../src/themes";

type Props = {
  filled?: boolean;
  size?: number;
  color?: string;
  onPress?: () => void;
};

export default function ToggleBellIcon({
  filled = false,
  size = spacing(24),
  color = themes.colors.grayDark,
  onPress,
}: Props) {
  const BellPath = filled
    ? "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14V11a6 6 0 0 0-5-5.9V5a1 1 0 0 0-2 0v.1A6 6 0 0 0 6 11v3c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"
    : "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14V11a6 6 0 0 0-5-5.9V5a1 1 0 0 0-2 0v.1A6 6 0 0 0 6 11v3c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 0 1-6 0"; // same path works, but fill attribute differs
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? color : "none"}
        stroke={filled ? undefined : color}
        strokeWidth={filled ? 0 : 2}
      >
        <Path d={BellPath} />
      </Svg>
    </TouchableOpacity>
  );
}
