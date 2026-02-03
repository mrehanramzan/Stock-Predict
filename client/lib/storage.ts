import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WatchlistItem } from "@/types/stock";

const WATCHLIST_KEY = "@stockpredict/watchlist";

export async function getWatchlist(): Promise<WatchlistItem[]> {
  try {
    const data = await AsyncStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading watchlist:", error);
    return [];
  }
}

export async function addToWatchlist(item: WatchlistItem): Promise<WatchlistItem[]> {
  try {
    const watchlist = await getWatchlist();
    const exists = watchlist.some((w) => w.symbol === item.symbol);
    if (!exists) {
      watchlist.unshift(item);
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
    return watchlist;
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    throw error;
  }
}

export async function removeFromWatchlist(symbol: string): Promise<WatchlistItem[]> {
  try {
    const watchlist = await getWatchlist();
    const filtered = watchlist.filter((w) => w.symbol !== symbol);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    throw error;
  }
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
  try {
    const watchlist = await getWatchlist();
    return watchlist.some((w) => w.symbol === symbol);
  } catch (error) {
    return false;
  }
}

export async function clearWatchlist(): Promise<void> {
  try {
    await AsyncStorage.removeItem(WATCHLIST_KEY);
  } catch (error) {
    console.error("Error clearing watchlist:", error);
  }
}
