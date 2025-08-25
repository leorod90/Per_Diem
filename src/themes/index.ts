import { Dimensions, Platform, PixelRatio } from 'react-native'

const {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

const scaleVertical = SCREEN_HEIGHT / 812;

export function spacing(size: number) {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1
  }
}

export function getNormalizedVerticalSizeWithPlatformOffset(size: number) {
  const newSize = size * scaleVertical
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1
  }
}

export default {
  colors: {
    black: "#212121",
    gray: "#B0B0B0",
    grayDark: "#555",
    white: "#FAFAFA",
    backgroundColor: "#FFFAF1",
    primary: "#87A5E4",
    secondary: "#F1C6A1",
    tertiary: "#A8D0E6",
    accent: "#48C78E",
    danger: "#F87171",
    googleBlue: "#4285F4",
  },
  sizing: {
    defaultPadding: spacing(20),
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Avenir Next' : 'Roboto',
    sm: spacing(16),
    md: spacing(18),
    lg: spacing(24),
    xl: spacing(28),
  },
}