import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { PredictionBadge } from "@/components/PredictionBadge";
import type { Prediction } from "@/types/stock";

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const { theme } = useTheme();

  const gradientColors = {
    bullish: [theme.positive + "15", theme.positive + "05"] as const,
    bearish: [theme.negative + "15", theme.negative + "05"] as const,
    neutral: [theme.backgroundSecondary, theme.backgroundDefault] as const,
  };

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
        colors={gradientColors[prediction.sentiment]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="cpu" size={18} color={theme.primary} />
          <ThemedText style={styles.title}>AI Prediction</ThemedText>
        </View>
        <PredictionBadge
          sentiment={prediction.sentiment}
          confidence={prediction.confidence}
          size="medium"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.targetRow}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
            Target Price
          </ThemedText>
          <ThemedText style={styles.targetPrice}>
            ${prediction.targetPrice.toFixed(2)}
          </ThemedText>
        </View>

        <View style={styles.divider} />

        <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
          Recommendation
        </ThemedText>
        <ThemedText style={styles.recommendation}>
          {prediction.recommendation}
        </ThemedText>

        <View style={styles.reasoningContainer}>
          <Feather
            name="info"
            size={14}
            color={theme.textSecondary}
            style={styles.infoIcon}
          />
          <ThemedText
            style={[styles.reasoning, { color: theme.textSecondary }]}
          >
            {prediction.reasoning}
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
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  targetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    marginBottom: Spacing.xs,
  },
  targetPrice: {
    fontSize: 24,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: Spacing.md,
  },
  recommendation: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: Spacing.md,
  },
  reasoningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  infoIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  reasoning: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});
