import React, { useState } from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PriceChartProps {
  data: number[];
  timestamps?: number[];
  isPositive: boolean;
  height?: number;
}

const PERIODS = ["1D", "1W", "1M", "3M", "1Y"] as const;
type Period = (typeof PERIODS)[number];

export function PriceChart({
  data,
  timestamps,
  isPositive,
  height = 200,
}: PriceChartProps) {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1M");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - Spacing.lg * 2;
  const chartHeight = height;
  const padding = { top: 20, bottom: 30, left: 10, right: 10 };

  const color = isPositive ? theme.positive : theme.negative;

  const chartData = data.length > 0 ? data : generateMockData();

  const minValue = Math.min(...chartData);
  const maxValue = Math.max(...chartData);
  const range = maxValue - minValue || 1;

  const points = chartData.map((value, index) => {
    const x =
      padding.left +
      (index / (chartData.length - 1)) * (chartWidth - padding.left - padding.right);
    const y =
      padding.top +
      (1 - (value - minValue) / range) * (chartHeight - padding.top - padding.bottom);
    return { x, y, value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;

  const handlePeriodChange = (period: Period) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPeriod(period);
    setSelectedIndex(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.periodSelector}>
        {PERIODS.map((period) => (
          <Pressable
            key={period}
            onPress={() => handlePeriodChange(period)}
            style={[
              styles.periodButton,
              selectedPeriod === period && {
                backgroundColor: theme.primary,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.periodText,
                {
                  color:
                    selectedPeriod === period ? theme.buttonText : theme.textSecondary,
                },
              ]}
            >
              {period}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={{ height: chartHeight }}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#chartGradient)" />
          <Path d={linePath} stroke={color} strokeWidth={2} fill="none" />
          {selectedIndex !== null && points[selectedIndex] ? (
            <Circle
              cx={points[selectedIndex].x}
              cy={points[selectedIndex].y}
              r={6}
              fill={color}
              stroke={theme.backgroundDefault}
              strokeWidth={2}
            />
          ) : null}
        </Svg>
      </View>

      {selectedIndex !== null && points[selectedIndex] ? (
        <View style={[styles.tooltip, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText style={styles.tooltipPrice}>
            ${points[selectedIndex].value.toFixed(2)}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

function generateMockData(): number[] {
  const points = 30;
  const data: number[] = [];
  let value = 150;

  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.48) * 5;
    value = Math.max(100, Math.min(200, value));
    data.push(value);
  }

  return data;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  periodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  periodText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tooltip: {
    position: "absolute",
    top: Spacing["3xl"],
    left: Spacing.lg,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  tooltipPrice: {
    fontSize: 15,
    fontWeight: "600",
  },
});
