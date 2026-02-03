import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line, Text as SvgText } from "react-native-svg";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PortfolioChartProps {
  data: number[];
  labels?: string[];
  title?: string;
  height?: number;
}

export function PortfolioChart({
  data,
  labels,
  title,
  height = 180,
}: PortfolioChartProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - Spacing.lg * 2;
  const padding = { top: 20, bottom: 40, left: 10, right: 10 };

  const chartData = data.length > 0 ? data : generateMockData();

  const minValue = Math.min(...chartData);
  const maxValue = Math.max(...chartData);
  const range = maxValue - minValue || 1;

  const isPositive = chartData[chartData.length - 1] >= chartData[0];
  const color = isPositive ? theme.positive : theme.negative;

  const points = chartData.map((value, index) => {
    const x =
      padding.left +
      (index / (chartData.length - 1)) * (chartWidth - padding.left - padding.right);
    const y =
      padding.top +
      (1 - (value - minValue) / range) * (height - padding.top - padding.bottom);
    return { x, y, value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

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
      {title ? (
        <ThemedText style={styles.title}>{title}</ThemedText>
      ) : null}
      <Svg width={chartWidth} height={height}>
        <Defs>
          <LinearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <Line
            key={i}
            x1={padding.left}
            y1={padding.top + ratio * (height - padding.top - padding.bottom)}
            x2={chartWidth - padding.right}
            y2={padding.top + ratio * (height - padding.top - padding.bottom)}
            stroke={theme.border}
            strokeWidth={0.5}
            strokeDasharray="4,4"
          />
        ))}

        <Path d={areaPath} fill="url(#portfolioGradient)" />
        <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" />

        <Circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={5}
          fill={color}
          stroke={theme.backgroundDefault}
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}

function generateMockData(): number[] {
  const points = 12;
  const data: number[] = [];
  let value = 10000;

  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.45) * 500;
    value = Math.max(8000, value);
    data.push(value);
  }

  return data;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    overflow: "hidden",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
});
