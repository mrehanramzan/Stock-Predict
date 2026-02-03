import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type Sentiment = "bullish" | "bearish" | "neutral";

interface PredictionBadgeProps {
  sentiment: Sentiment;
  confidence?: number;
  size?: "small" | "medium" | "large";
}

export function PredictionBadge({
  sentiment,
  confidence,
  size = "medium",
}: PredictionBadgeProps) {
  const { theme } = useTheme();

  const config = {
    bullish: {
      color: theme.positive,
      icon: "trending-up" as const,
      label: "Bullish",
    },
    bearish: {
      color: theme.negative,
      icon: "trending-down" as const,
      label: "Bearish",
    },
    neutral: {
      color: theme.textSecondary,
      icon: "minus" as const,
      label: "Neutral",
    },
  };

  const { color, icon, label } = config[sentiment];

  const sizeStyles = {
    small: {
      padding: Spacing.xs,
      fontSize: 11,
      iconSize: 12,
    },
    medium: {
      padding: Spacing.sm,
      fontSize: 13,
      iconSize: 14,
    },
    large: {
      padding: Spacing.md,
      fontSize: 15,
      iconSize: 18,
    },
  };

  const sizeConfig = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${color}15`,
          paddingHorizontal: sizeConfig.padding,
          paddingVertical: sizeConfig.padding / 2,
        },
      ]}
    >
      <Feather name={icon} size={sizeConfig.iconSize} color={color} />
      <ThemedText
        style={[
          styles.label,
          { color, fontSize: sizeConfig.fontSize, marginLeft: Spacing.xs },
        ]}
      >
        {label}
      </ThemedText>
      {confidence !== undefined ? (
        <ThemedText
          style={[
            styles.confidence,
            { color, fontSize: sizeConfig.fontSize - 2 },
          ]}
        >
          {confidence}%
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.xs,
  },
  label: {
    fontWeight: "600",
  },
  confidence: {
    marginLeft: Spacing.xs,
    opacity: 0.8,
  },
});
