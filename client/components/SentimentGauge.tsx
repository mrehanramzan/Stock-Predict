import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, Circle, G, Text as SvgText } from "react-native-svg";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SentimentGaugeProps {
  bullish: number;
  bearish: number;
  neutral: number;
}

export function SentimentGauge({ bullish, bearish, neutral }: SentimentGaugeProps) {
  const { theme } = useTheme();
  const total = bullish + bearish + neutral || 1;

  const bullishPercent = (bullish / total) * 100;
  const bearishPercent = (bearish / total) * 100;

  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const circumference = 2 * Math.PI * radius * 0.75;
  const bullishLength = (bullishPercent / 100) * circumference;
  const bearishLength = (bearishPercent / 100) * circumference;
  const neutralLength = circumference - bullishLength - bearishLength;

  const sentiment = bullishPercent > bearishPercent ? "Bullish" : bearishPercent > bullishPercent ? "Bearish" : "Neutral";
  const sentimentColor = sentiment === "Bullish" ? theme.positive : sentiment === "Bearish" ? theme.negative : theme.textSecondary;

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
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={size}>
          <G rotation="-135" origin={`${center}, ${center}`}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.border}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference * 0.33}`}
              strokeLinecap="round"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.positive}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${bullishLength} ${2 * Math.PI * radius}`}
              strokeLinecap="round"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.negative}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${bearishLength} ${2 * Math.PI * radius}`}
              strokeDashoffset={-bullishLength - neutralLength}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.centerContent}>
          <ThemedText style={[styles.sentimentLabel, { color: sentimentColor }]}>
            {sentiment}
          </ThemedText>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.positive }]} />
          <ThemedText style={[styles.legendText, { color: theme.textSecondary }]}>
            Bullish {bullishPercent.toFixed(0)}%
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.negative }]} />
          <ThemedText style={[styles.legendText, { color: theme.textSecondary }]}>
            Bearish {bearishPercent.toFixed(0)}%
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: "center",
  },
  gaugeContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  sentimentLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    gap: Spacing.xl,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
