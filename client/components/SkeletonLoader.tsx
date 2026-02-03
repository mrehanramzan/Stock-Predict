import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.xs,
  style,
}: SkeletonLoaderProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function StockCardSkeleton() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.stockCard,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <View style={styles.leftContent}>
        <SkeletonLoader width={60} height={18} style={styles.symbolSkeleton} />
        <SkeletonLoader width={100} height={14} />
      </View>
      <View style={styles.rightContent}>
        <SkeletonLoader width={70} height={18} style={styles.priceSkeleton} />
        <SkeletonLoader width={50} height={20} borderRadius={BorderRadius.xs} />
      </View>
    </View>
  );
}

export function MarketIndexSkeleton() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.marketIndex,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <SkeletonLoader width={80} height={14} style={styles.indexName} />
      <SkeletonLoader width={100} height={24} style={styles.indexPrice} />
      <SkeletonLoader width={70} height={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  leftContent: {
    flex: 1,
  },
  symbolSkeleton: {
    marginBottom: Spacing.xs,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  priceSkeleton: {
    marginBottom: Spacing.xs,
  },
  marketIndex: {
    width: 150,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  indexName: {
    marginBottom: Spacing.sm,
  },
  indexPrice: {
    marginBottom: Spacing.xs,
  },
});
