import { StyleSheet, Text } from 'react-native';
import React, { ReactNode } from 'react';
import themes from '../themes';

interface Props {
  color?: string;
  size?: number;
  children: ReactNode;
  style?: any
}

export default function CustomHeading({
  color = themes.colors.black,
  size = themes.text.lg,
  children,
  style = {}
}: Props) {
  return (
    <Text style={[styles.text, style, { color, fontSize: size }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: themes.text.fontFamily,
    fontWeight: 600
  }
});