import React from "react";
import { StyleSheet, View, ScrollView, RefreshControl, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useMarketIndices, useTrendingStocks } from "@/hooks/useStockData";
import { StockCard } from "@/components/StockCard";
import { MarketIndexCard } from "@/components/MarketIndexCard";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
import { PortfolioChart } from "@/components/PortfolioChart";
import { PerformanceCard } from "@/components/PerformanceCard";
import {
  StockCardSkeleton,
  MarketIndexSkeleton,
} from "@/components/SkeletonLoader";
import { FAB } from "@/components/FAB";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MarketsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const {
    data: indices,
    isLoading: indicesLoading,
    refetch: refetchIndices,
    isError: indicesError,
  } = useMarketIndices();

  const {
    data: trending,
    isLoading: trendingLoading,
    refetch: refetchTrending,
    isError: trendingError,
  } = useTrendingStocks();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchIndices(), refetchTrending()]);
    setRefreshing(false);
  };

  const handleStockPress = (symbol: string) => {
    navigation.navigate("StockDetail", { symbol });
  };

  const handleSearchPress = () => {
    navigation.navigate("SearchModal");
  };

  const isLoading = indicesLoading || trendingLoading;
  const hasError = indicesError && trendingError;

  if (hasError && !isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <EmptyState
          image={require("../../assets/images/empty-markets.png")}
          title="Unable to Load Markets"
          description="We couldn't fetch market data. Please check your connection and try again."
          actionLabel="Try Again"
          onAction={handleRefresh}
        />
        <FAB onPress={handleSearchPress} bottom={tabBarHeight + Spacing.lg} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <LinearGradient
        colors={
          isDark
            ? ["#1e3a5f20", "transparent"]
            : ["#dbeafe40", "transparent"]
        }
        style={styles.headerGradient}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeText}>Good Morning</ThemedText>
          <ThemedText style={[styles.welcomeSubtext, { color: theme.textSecondary }]}>
            Here's your market overview
          </ThemedText>
        </View>

        <View style={styles.performanceRow}>
          <PerformanceCard
            title="Portfolio Value"
            value="$24,532"
            change={2.45}
            icon="briefcase"
          />
          <PerformanceCard
            title="Today's Gain"
            value="$523"
            change={1.87}
            icon="trending-up"
          />
        </View>

        <PortfolioChart
          data={[]}
          title="Portfolio Performance"
        />

        <SectionHeader title="Market Indices" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.indicesScroll}
          contentContainerStyle={styles.indicesContent}
        >
          {indicesLoading ? (
            <>
              <MarketIndexSkeleton />
              <MarketIndexSkeleton />
              <MarketIndexSkeleton />
            </>
          ) : (
            indices?.map((index) => (
              <MarketIndexCard key={index.symbol} index={index} />
            ))
          )}
        </ScrollView>

        <SectionHeader title="Trending Stocks" actionLabel="See All" onAction={handleSearchPress} />
        {trendingLoading ? (
          <>
            <StockCardSkeleton />
            <StockCardSkeleton />
            <StockCardSkeleton />
            <StockCardSkeleton />
          </>
        ) : trending && trending.length > 0 ? (
          trending.slice(0, 6).map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onPress={() => handleStockPress(stock.symbol)}
              showChart
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              image={require("../../assets/images/empty-markets.png")}
              title="No Trending Stocks"
              description="Check back later for trending market data."
            />
          </View>
        )}
      </ScrollView>

      <FAB onPress={handleSearchPress} bottom={tabBarHeight + Spacing.lg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    marginBottom: Spacing.xl,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 15,
  },
  performanceRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  indicesScroll: {
    marginHorizontal: -Spacing.lg,
    marginBottom: Spacing.md,
  },
  indicesContent: {
    paddingHorizontal: Spacing.lg,
  },
  emptyContainer: {
    marginTop: Spacing["2xl"],
  },
});
