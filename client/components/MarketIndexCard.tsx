import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { MarketIndex } from "@/types/stock";

interface MarketIndexCardProps {
  index: MarketIndex;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MarketIndexCard({ index, onPress }: MarketIndexCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const isPositive = index.change >= 0;
  const changeColor = isPositive ? theme.positive : theme.negative;
  const changePrefix = isPositive ? "+" : "";

  return (
    <AnimatedPressable
      onPress={onPress}
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
      <View style={styles.header}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {index.name}
        </ThemedText>
        <Feather
          name={isPositive ? "trending-up" : "trending-down"}
          size={16}
          color={changeColor}
        />
      </View>
      <ThemedText style={styles.price}>
        {index.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </ThemedText>
      <ThemedText style={[styles.change, { color: changeColor }]}>
        {changePrefix}{index.change.toFixed(2)} ({changePrefix}{index.changePercent.toFixed(2)}%)
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    marginRight: Spacing.xs,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  change: {
    fontSize: 13,
    fontWeight: "500",
  },
});
