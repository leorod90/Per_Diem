import React from "react";
import Svg, { Line } from "react-native-svg";
import themes, { spacing } from "../../src/themes";

type Props = {
  size?: number;
  color?: string;
};

const CloseIcon: React.FC<Props> = ({ size = spacing(24), color = themes.colors.black}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Line
        x1="6"
        y1="18"
        x2="18"
        y2="6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default CloseIcon;
