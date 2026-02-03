import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { MiniChart } from "@/components/MiniChart";
import type { Stock } from "@/types/stock";

interface StockCardProps {
  stock: Stock;
  onPress?: () => void;
  showChart?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StockCard({ stock, onPress, showChart = false }: StockCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const isPositive = stock.change >= 0;
  const changeColor = isPositive ? theme.positive : theme.negative;
  const changePrefix = isPositive ? "+" : "";

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.leftContent}>
        <ThemedText style={styles.symbol}>{stock.symbol}</ThemedText>
        <ThemedText
          style={[styles.name, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {stock.name}
        </ThemedText>
      </View>

      {showChart ? (
        <View style={styles.chartContainer}>
          <MiniChart isPositive={isPositive} />
        </View>
      ) : null}

      <View style={styles.rightContent}>
        <ThemedText style={styles.price}>
          ${stock.price.toFixed(2)}
        </ThemedText>
        <View
          style={[
            styles.changeBadge,
            { backgroundColor: isPositive ? `${theme.positive}15` : `${theme.negative}15` },
          ]}
        >
          <ThemedText style={[styles.change, { color: changeColor }]}>
            {changePrefix}{stock.changePercent.toFixed(2)}%
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
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
  symbol: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
  },
  chartContainer: {
    width: 60,
    height: 30,
    marginHorizontal: Spacing.md,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  changeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  change: {
    fontSize: 13,
    fontWeight: "500",
  },
});
