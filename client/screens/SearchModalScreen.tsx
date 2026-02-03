import React, { useState, useCallback } from "react";
import { StyleSheet, View, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useDebouncedCallback } from "use-debounce";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { SearchInput } from "@/components/SearchInput";
import { useStockSearch, useWatchlist } from "@/hooks/useStockData";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
];

export default function SearchModalScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
  }, 300);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const { data: searchResults, isLoading } = useStockSearch(debouncedQuery);
  const { addToWatchlist, watchlist } = useWatchlist();

  const handleStockPress = (symbol: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("StockDetail", { symbol });
  };

  const handleAddToWatchlist = (symbol: string, name: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToWatchlist({
      symbol,
      name,
      addedAt: Date.now(),
    });
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some((w) => w.symbol === symbol);
  };

  const results = searchResults?.result || [];
  const showPopular = !debouncedQuery;

  const renderItem = ({
    item,
  }: {
    item: { symbol: string; description?: string; name?: string };
  }) => {
    const name = item.description || item.name || "";
    const inList = isInWatchlist(item.symbol);

    return (
      <Pressable
        onPress={() => handleStockPress(item.symbol)}
        style={({ pressed }) => [
          styles.resultItem,
          {
            backgroundColor: pressed
              ? theme.backgroundSecondary
              : theme.backgroundDefault,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.resultLeft}>
          <ThemedText style={styles.resultSymbol}>{item.symbol}</ThemedText>
          <ThemedText
            style={[styles.resultName, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {name}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => handleAddToWatchlist(item.symbol, name)}
          style={styles.addButton}
          disabled={inList}
        >
          <Feather
            name={inList ? "check" : "plus"}
            size={20}
            color={inList ? theme.positive : theme.primary}
          />
        </Pressable>
      </Pressable>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[
            styles.resultItem,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.resultLeft}>
            <SkeletonLoader width={60} height={18} style={{ marginBottom: Spacing.xs }} />
            <SkeletonLoader width={150} height={14} />
          </View>
          <SkeletonLoader width={32} height={32} borderRadius={BorderRadius.full} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.searchContainer,
          {
            paddingTop: headerHeight + Spacing.md,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search by symbol or name..."
          autoFocus
        />
      </View>

      {showPopular ? (
        <View style={styles.popularSection}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Popular Stocks
          </ThemedText>
          <FlatList
            data={POPULAR_STOCKS}
            renderItem={renderItem}
            keyExtractor={(item) => item.symbol}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : isLoading ? (
        renderSkeleton()
      ) : results.length > 0 ? (
        <FlatList
          data={results.filter((r) => r.type === "Common Stock").slice(0, 20)}
          renderItem={renderItem}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResults}>
          <Feather name="search" size={48} color={theme.textSecondary} />
          <ThemedText style={[styles.noResultsText, { color: theme.textSecondary }]}>
            No stocks found for "{debouncedQuery}"
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  popularSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  resultLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  resultSymbol: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 2,
  },
  resultName: {
    fontSize: 13,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  noResults: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["3xl"],
    gap: Spacing.lg,
  },
  noResultsText: {
    fontSize: 15,
    textAlign: "center",
  },
});
