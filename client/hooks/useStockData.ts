import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getApiUrl } from "@/lib/query-client";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
} from "@/lib/storage";
import type { Stock, MarketIndex, StockSearch, Prediction, WatchlistItem } from "@/types/stock";

export function useMarketIndices() {
  return useQuery<MarketIndex[]>({
    queryKey: ["/api/stocks/indices"],
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

export function useTrendingStocks() {
  return useQuery<Stock[]>({
    queryKey: ["/api/stocks/trending"],
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

export function useStockQuote(symbol: string) {
  return useQuery<Stock>({
    queryKey: ["/api/stocks/quote", symbol],
    enabled: !!symbol,
    staleTime: 30000,
  });
}

export function useStockSearch(query: string) {
  return useQuery<StockSearch>({
    queryKey: ["/api/stocks/search", query],
    enabled: query.length >= 1,
    staleTime: 300000,
  });
}

export function useStockChart(symbol: string, period: string = "1M") {
  return useQuery<{ prices: number[]; timestamps: number[] }>({
    queryKey: ["/api/stocks/chart", symbol, period],
    enabled: !!symbol,
    staleTime: 300000,
  });
}

export function useStockPrediction(symbol: string) {
  return useQuery<Prediction>({
    queryKey: ["/api/stocks/prediction", symbol],
    enabled: !!symbol,
    staleTime: 600000,
  });
}

export function useWatchlist() {
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: (data) => {
      queryClient.setQueryData(["watchlist"], data);
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: (data) => {
      queryClient.setQueryData(["watchlist"], data);
    },
  });

  return {
    watchlist: watchlistQuery.data || [],
    isLoading: watchlistQuery.isLoading,
    addToWatchlist: addMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

export function useWatchlistStocks() {
  const { watchlist } = useWatchlist();
  const symbols = watchlist.map((w) => w.symbol).join(",");

  return useQuery<Stock[]>({
    queryKey: ["/api/stocks/quotes", symbols],
    enabled: symbols.length > 0,
    staleTime: 60000,
    refetchInterval: 60000,
  });
}

export function useIsInWatchlist(symbol: string) {
  const { watchlist } = useWatchlist();
  return watchlist.some((w) => w.symbol === symbol);
}

export function usePortfolioPredictions() {
  const { watchlist } = useWatchlist();
  const symbols = watchlist.map((w) => w.symbol).join(",");

  return useQuery<Prediction[]>({
    queryKey: ["/api/stocks/predictions", symbols],
    enabled: symbols.length > 0,
    staleTime: 600000,
  });
}
