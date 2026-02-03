import React from "react";
import { StyleSheet, View, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
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
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
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

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <ThemedText style={styles.headerTitle}>My Watchlist</ThemedText>
      <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
        {watchlist.length > 0 ? `Tracking ${watchlist.length} stocks` : "Track your favorite stocks"}
      </ThemedText>
    </View>
  );

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
      {isLoading && watchlist.length === 0 ? (
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + Spacing["3xl"],
              paddingHorizontal: Spacing.lg,
            },
          ]}
        >
          {renderHeader()}
          {renderLoading()}
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: insets.top + Spacing["3xl"],
              paddingBottom: tabBarHeight + Spacing.xl,
              paddingHorizontal: Spacing.lg,
            },
            isEmpty && styles.emptyContent,
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          data={stocks || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.symbol}
          ListHeaderComponent={isEmpty ? null : renderHeader}
          ListEmptyComponent={isEmpty ? renderEmpty : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
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
  headerSection: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
  },
  loadingContainer: {
    marginTop: Spacing.lg,
  },
});
