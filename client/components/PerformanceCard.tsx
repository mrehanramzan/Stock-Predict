import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PerformanceCardProps {
  title: string;
  value: string;
  change: number;
  icon: keyof typeof Feather.glyphMap;
}

export function PerformanceCard({ title, value, change, icon }: PerformanceCardProps) {
  const { theme } = useTheme();
  const isPositive = change >= 0;
  const changeColor = isPositive ? theme.positive : theme.negative;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <LinearGradient
        colors={[`${theme.primary}10`, `${theme.primary}05`]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
        <Feather name={icon} size={18} color={theme.primary} />
      </View>
      <ThemedText style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <View style={styles.changeRow}>
        <Feather
          name={isPositive ? "arrow-up-right" : "arrow-down-right"}
          size={14}
          color={changeColor}
        />
        <ThemedText style={[styles.change, { color: changeColor }]}>
          {isPositive ? "+" : ""}{change.toFixed(2)}%
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  change: {
    fontSize: 12,
    fontWeight: "500",
  },
});
