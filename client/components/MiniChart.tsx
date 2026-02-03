import React from "react";
import { View } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

import { useTheme } from "@/hooks/useTheme";

interface MiniChartProps {
  isPositive: boolean;
  data?: number[];
}

export function MiniChart({ isPositive, data }: MiniChartProps) {
  const { theme } = useTheme();
  const color = isPositive ? theme.positive : theme.negative;

  const chartData = data || generateRandomData(isPositive);
  const width = 60;
  const height = 30;
  const padding = 2;

  const minValue = Math.min(...chartData);
  const maxValue = Math.max(...chartData);
  const range = maxValue - minValue || 1;

  const points = chartData.map((value, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={`gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill={`url(#gradient-${isPositive})`} />
        <Path d={linePath} stroke={color} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}

function generateRandomData(isPositive: boolean): number[] {
  const points = 12;
  const data: number[] = [];
  let value = 50;

  for (let i = 0; i < points; i++) {
    const trend = isPositive ? 0.3 : -0.3;
    value += (Math.random() - 0.5 + trend) * 10;
    value = Math.max(10, Math.min(90, value));
    data.push(value);
  }

  return data;
}
