import React from "react";
import { StyleSheet, View, ScrollView, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { useMarketIndices, useTrendingStocks } from "@/hooks/useStockData";
import { StockCard } from "@/components/StockCard";
import { MarketIndexCard } from "@/components/MarketIndexCard";
import { SectionHeader } from "@/components/SectionHeader";
import { EmptyState } from "@/components/EmptyState";
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
  const { theme } = useTheme();
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
        <SectionHeader title="Market Overview" />
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

        <SectionHeader title="Trending Stocks" />
        {trendingLoading ? (
          <>
            <StockCardSkeleton />
            <StockCardSkeleton />
            <StockCardSkeleton />
            <StockCardSkeleton />
            <StockCardSkeleton />
          </>
        ) : trending && trending.length > 0 ? (
          trending.map((stock) => (
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
  scrollView: {
    flex: 1,
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
