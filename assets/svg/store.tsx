import React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";

interface StoreLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export const StoreLogo: React.FC<StoreLogoProps> = ({
  width = 64,
  height = 64,
  color = "#4CAF50",
}) => (
  <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
    {/* Roof */}
    <Path
      d="M8 24 L32 8 L56 24"
      stroke={color}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Store building */}
    <Rect
      x={12}
      y={24}
      width={40}
      height={32}
      rx={4}
      stroke={color}
      strokeWidth={4}
      fill="white"
    />
    {/* Door */}
    <Rect
      x={28}
      y={36}
      width={8}
      height={20}
      rx={2}
      fill={color}
    />
    {/* Windows */}
    <Rect x={16} y={28} width={8} height={8} rx={1} fill={color} />
    <Rect x={40} y={28} width={8} height={8} rx={1} fill={color} />
    {/* Optional little circle sign */}
    <Circle cx={32} cy={20} r={4} fill={color} />
  </Svg>
);
