import React from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useWatchlist, usePortfolioPredictions } from "@/hooks/useStockData";
import { PredictionBadge } from "@/components/PredictionBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { FAB } from "@/components/FAB";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Prediction } from "@/types/stock";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { watchlist } = useWatchlist();
  const {
    data: predictions,
    isLoading,
    refetch,
  } = usePortfolioPredictions();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSearchPress = () => {
    navigation.navigate("SearchModal");
  };

  const handleStockPress = (symbol: string) => {
    navigation.navigate("StockDetail", { symbol });
  };

  const isEmpty = watchlist.length === 0;

  const getSummary = () => {
    if (!predictions || predictions.length === 0) {
      return { bullish: 0, bearish: 0, neutral: 0 };
    }
    return predictions.reduce(
      (acc, p) => {
        acc[p.sentiment]++;
        return acc;
      },
      { bullish: 0, bearish: 0, neutral: 0 }
    );
  };

  const summary = getSummary();

  if (isEmpty) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View
          style={[
            styles.emptyContainer,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: tabBarHeight + Spacing.xl,
            },
          ]}
        >
          <EmptyState
            image={require("../../assets/images/empty-watchlist.png")}
            title="No Insights Available"
            description="Add stocks to your watchlist to see AI-powered predictions and insights."
            actionLabel="Add Stocks"
            onAction={handleSearchPress}
          />
        </View>
        <FAB onPress={handleSearchPress} bottom={tabBarHeight + Spacing.lg} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <Feather name="bar-chart-2" size={20} color={theme.primary} />
            <ThemedText style={styles.summaryTitle}>
              Portfolio Summary
            </ThemedText>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statValue, { color: theme.positive }]}>
                {summary.bullish}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                Bullish
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statValue, { color: theme.negative }]}>
                {summary.bearish}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                Bearish
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statValue, { color: theme.textSecondary }]}>
                {summary.neutral}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                Neutral
              </ThemedText>
            </View>
          </View>
        </View>

        <SectionHeader title="Stock Predictions" />

        {isLoading ? (
          <>
            <PredictionItemSkeleton theme={theme} />
            <PredictionItemSkeleton theme={theme} />
            <PredictionItemSkeleton theme={theme} />
          </>
        ) : predictions && predictions.length > 0 ? (
          predictions.map((prediction) => (
            <PredictionItem
              key={prediction.symbol}
              prediction={prediction}
              theme={theme}
              onPress={() => handleStockPress(prediction.symbol)}
            />
          ))
        ) : (
          <ThemedText style={[styles.noData, { color: theme.textSecondary }]}>
            Unable to load predictions. Pull to refresh.
          </ThemedText>
        )}
      </ScrollView>
      <FAB onPress={handleSearchPress} bottom={tabBarHeight + Spacing.lg} />
    </View>
  );
}

function PredictionItem({
  prediction,
  theme,
  onPress,
}: {
  prediction: Prediction;
  theme: any;
  onPress: () => void;
}) {
  return (
    <View
      style={[
        styles.predictionItem,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <View style={styles.predictionLeft}>
        <ThemedText style={styles.predictionSymbol}>
          {prediction.symbol}
        </ThemedText>
        <ThemedText
          style={[styles.predictionTarget, { color: theme.textSecondary }]}
        >
          Target: ${prediction.targetPrice.toFixed(2)}
        </ThemedText>
      </View>
      <View style={styles.predictionRight}>
        <PredictionBadge
          sentiment={prediction.sentiment}
          confidence={prediction.confidence}
          size="small"
        />
      </View>
    </View>
  );
}

function PredictionItemSkeleton({ theme }: { theme: any }) {
  return (
    <View
      style={[
        styles.predictionItem,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <View style={styles.predictionLeft}>
        <SkeletonLoader width={60} height={18} style={{ marginBottom: Spacing.xs }} />
        <SkeletonLoader width={100} height={14} />
      </View>
      <SkeletonLoader width={80} height={24} borderRadius={BorderRadius.xs} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  predictionLeft: {
    flex: 1,
  },
  predictionRight: {},
  predictionSymbol: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  predictionTarget: {
    fontSize: 13,
  },
  noData: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
    fontSize: 15,
  },
});
