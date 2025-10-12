import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {borderRadius, colors, shadows, spacing, typography} from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  primary: {
    backgroundColor: colors.primary,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  secondary: {
    backgroundColor: colors.secondary,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.bodyBold,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  primaryText: {
    color: colors.white,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  secondaryText: {
    color: colors.white,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  outlineText: {
    color: colors.primary,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallText: {
    fontSize: 14,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumText: {
    fontSize: 16,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  largeText: {
    fontSize: 18,
  },
});

export default Button;
