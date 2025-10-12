import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {borderRadius, colors, shadows, spacing} from '../styles/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Card: React.FC<CardProps> = ({children, style}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
});

export default Card;
