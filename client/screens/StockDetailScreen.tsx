import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  useStockQuote,
  useStockChart,
  useStockPrediction,
  useWatchlist,
  useIsInWatchlist,
} from "@/hooks/useStockData";
import { PriceChart } from "@/components/PriceChart";
import { PredictionCard } from "@/components/PredictionCard";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteProps = RouteProp<RootStackParamList, "StockDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function StockDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { symbol } = route.params;

  const { data: stock, isLoading: stockLoading } = useStockQuote(symbol);
  const { data: chartData, isLoading: chartLoading } = useStockChart(symbol);
  const { data: prediction, isLoading: predictionLoading } = useStockPrediction(symbol);
  const { addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isInWatchlist = useIsInWatchlist(symbol);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: symbol,
      headerRight: () => (
        <Pressable onPress={handleWatchlistToggle} style={styles.headerButton}>
          <Feather
            name={isInWatchlist ? "star" : "star"}
            size={22}
            color={isInWatchlist ? theme.primary : theme.textSecondary}
            style={{ opacity: isInWatchlist ? 1 : 0.6 }}
          />
        </Pressable>
      ),
    });
  }, [symbol, isInWatchlist, theme]);

  const handleWatchlistToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isInWatchlist) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist({
        symbol,
        name: stock?.name || symbol,
        addedAt: Date.now(),
      });
    }
  };

  const isPositive = (stock?.change || 0) >= 0;
  const changeColor = isPositive ? theme.positive : theme.negative;
  const changePrefix = isPositive ? "+" : "";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      {stockLoading ? (
        <View style={styles.priceSection}>
          <SkeletonLoader width={80} height={14} style={{ marginBottom: Spacing.sm }} />
          <SkeletonLoader width={150} height={36} style={{ marginBottom: Spacing.sm }} />
          <SkeletonLoader width={100} height={20} />
        </View>
      ) : stock ? (
        <View style={styles.priceSection}>
          <ThemedText style={[styles.companyName, { color: theme.textSecondary }]}>
            {stock.name}
          </ThemedText>
          <ThemedText style={styles.price}>${stock.price.toFixed(2)}</ThemedText>
          <View style={styles.changeRow}>
            <ThemedText style={[styles.change, { color: changeColor }]}>
              {changePrefix}${Math.abs(stock.change).toFixed(2)} ({changePrefix}
              {stock.changePercent.toFixed(2)}%)
            </ThemedText>
            <ThemedText style={[styles.timestamp, { color: theme.textSecondary }]}>
              Today
            </ThemedText>
          </View>
        </View>
      ) : null}

      {chartLoading ? (
        <View style={styles.chartPlaceholder}>
          <SkeletonLoader width="100%" height={200} borderRadius={BorderRadius.md} />
        </View>
      ) : (
        <PriceChart
          data={chartData?.prices || []}
          timestamps={chartData?.timestamps || []}
          isPositive={isPositive}
        />
      )}

      <View
        style={[
          styles.statsCard,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.statsRow}>
          <StatItem
            label="Open"
            value={`$${stock?.open?.toFixed(2) || "-"}`}
            theme={theme}
          />
          <StatItem
            label="High"
            value={`$${stock?.high?.toFixed(2) || "-"}`}
            theme={theme}
          />
          <StatItem
            label="Low"
            value={`$${stock?.low?.toFixed(2) || "-"}`}
            theme={theme}
          />
          <StatItem
            label="Prev Close"
            value={`$${stock?.previousClose?.toFixed(2) || "-"}`}
            theme={theme}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>AI Prediction</ThemedText>
        {predictionLoading ? (
          <SkeletonLoader width="100%" height={180} borderRadius={BorderRadius.lg} />
        ) : prediction ? (
          <PredictionCard prediction={prediction} />
        ) : (
          <View
            style={[
              styles.noPrediction,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Feather name="cpu" size={24} color={theme.textSecondary} />
            <ThemedText style={[styles.noPredictionText, { color: theme.textSecondary }]}>
              AI prediction not available for this stock
            </ThemedText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function StatItem({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={styles.statItem}>
      <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  priceSection: {
    marginBottom: Spacing.lg,
  },
  companyName: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  change: {
    fontSize: 17,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 13,
  },
  chartPlaceholder: {
    marginVertical: Spacing.lg,
  },
  statsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  noPrediction: {
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  noPredictionText: {
    fontSize: 14,
    textAlign: "center",
  },
});
