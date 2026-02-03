import React from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { useWatchlist, useWatchlistStocks } from "@/hooks/useStockData";
import { StockCard } from "@/components/StockCard";
import { EmptyState } from "@/components/EmptyState";
import { StockCardSkeleton } from "@/components/SkeletonLoader";
import { FAB } from "@/components/FAB";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { Stock } from "@/types/stock";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WatchlistScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const { watchlist, isLoading: watchlistLoading } = useWatchlist();
  const {
    data: stocks,
    isLoading: stocksLoading,
    refetch,
  } = useWatchlistStocks();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStockPress = (symbol: string) => {
    navigation.navigate("StockDetail", { symbol });
  };

  const handleSearchPress = () => {
    navigation.navigate("SearchModal");
  };

  const isLoading = watchlistLoading || stocksLoading;
  const isEmpty = !isLoading && watchlist.length === 0;

  const renderItem = ({ item }: { item: Stock }) => (
    <StockCard
      stock={item}
      onPress={() => handleStockPress(item.symbol)}
      showChart
    />
  );

  const renderEmpty = () => (
    <EmptyState
      image={require("../../assets/images/empty-watchlist.png")}
      title="No Stocks Yet"
      description="Add stocks to your watchlist to track their prices and get AI predictions."
      actionLabel="Search Stocks"
      onAction={handleSearchPress}
    />
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <StockCardSkeleton />
      <StockCardSkeleton />
      <StockCardSkeleton />
    </View>
  );

  if (isLoading && watchlist.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View
          style={[
            styles.content,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingHorizontal: Spacing.lg,
            },
          ]}
        >
          {renderLoading()}
        </View>
        <FAB onPress={handleSearchPress} bottom={tabBarHeight + Spacing.lg} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
            paddingHorizontal: Spacing.lg,
          },
          isEmpty && styles.emptyContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={stocks || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        ListEmptyComponent={isEmpty ? renderEmpty : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <FAB onPress={handleSearchPress} bottom={tabBarHeight + Spacing.lg} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContent: {
    justifyContent: "center",
  },
  loadingContainer: {
    marginTop: Spacing.lg,
  },
});
