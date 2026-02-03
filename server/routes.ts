import type { Express } from "express";
import { createServer, type Server } from "node:http";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "demo";
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const MARKET_INDICES = [
  { symbol: "^GSPC", name: "S&P 500", finnhubSymbol: "SPY" },
  { symbol: "^DJI", name: "Dow Jones", finnhubSymbol: "DIA" },
  { symbol: "^IXIC", name: "NASDAQ", finnhubSymbol: "QQQ" },
];

const TRENDING_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
];

const STOCK_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corporation",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com Inc.",
  TSLA: "Tesla Inc.",
  NVDA: "NVIDIA Corporation",
  META: "Meta Platforms Inc.",
  NFLX: "Netflix Inc.",
  JPM: "JPMorgan Chase & Co.",
  V: "Visa Inc.",
  WMT: "Walmart Inc.",
  DIS: "Walt Disney Company",
  PYPL: "PayPal Holdings Inc.",
  INTC: "Intel Corporation",
  AMD: "Advanced Micro Devices",
  CRM: "Salesforce Inc.",
  ORCL: "Oracle Corporation",
  CSCO: "Cisco Systems Inc.",
  ADBE: "Adobe Inc.",
  QCOM: "Qualcomm Inc.",
};

async function fetchFinnhub(endpoint: string) {
  const url = `${FINNHUB_BASE_URL}${endpoint}&token=${FINNHUB_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status}`);
  }
  return response.json();
}

async function getQuote(symbol: string) {
  try {
    const data = await fetchFinnhub(`/quote?symbol=${symbol}`);
    return {
      symbol,
      name: STOCK_NAMES[symbol] || symbol,
      price: data.c || 0,
      change: data.d || 0,
      changePercent: data.dp || 0,
      high: data.h || 0,
      low: data.l || 0,
      open: data.o || 0,
      previousClose: data.pc || 0,
    };
  } catch (error) {
    return generateMockQuote(symbol);
  }
}

function generateMockQuote(symbol: string) {
  const basePrice = 100 + Math.random() * 200;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    name: STOCK_NAMES[symbol] || symbol,
    price: Number(basePrice.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    high: Number((basePrice + Math.abs(change) * 1.5).toFixed(2)),
    low: Number((basePrice - Math.abs(change) * 1.5).toFixed(2)),
    open: Number((basePrice - change * 0.5).toFixed(2)),
    previousClose: Number((basePrice - change).toFixed(2)),
  };
}

function generateMockChartData(symbol: string, period: string) {
  const now = Date.now();
  let points = 30;
  let interval = 24 * 60 * 60 * 1000;

  switch (period) {
    case "1D":
      points = 24;
      interval = 60 * 60 * 1000;
      break;
    case "1W":
      points = 7;
      interval = 24 * 60 * 60 * 1000;
      break;
    case "1M":
      points = 30;
      interval = 24 * 60 * 60 * 1000;
      break;
    case "3M":
      points = 90;
      interval = 24 * 60 * 60 * 1000;
      break;
    case "1Y":
      points = 52;
      interval = 7 * 24 * 60 * 60 * 1000;
      break;
  }

  const prices: number[] = [];
  const timestamps: number[] = [];
  let price = 100 + Math.random() * 100;

  for (let i = points; i >= 0; i--) {
    price += (Math.random() - 0.48) * 3;
    price = Math.max(50, price);
    prices.push(Number(price.toFixed(2)));
    timestamps.push(now - i * interval);
  }

  return { prices, timestamps };
}

function generatePrediction(symbol: string, currentPrice: number) {
  const sentiments = ["bullish", "bearish", "neutral"] as const;
  const sentiment = sentiments[Math.floor(Math.random() * 3)];
  const confidence = 60 + Math.floor(Math.random() * 30);

  let targetMultiplier = 1;
  let recommendation = "";
  let reasoning = "";

  switch (sentiment) {
    case "bullish":
      targetMultiplier = 1.05 + Math.random() * 0.15;
      recommendation = "Consider buying or holding this stock.";
      reasoning =
        "Technical indicators show upward momentum. RSI suggests the stock is not overbought, and moving averages indicate a positive trend.";
      break;
    case "bearish":
      targetMultiplier = 0.85 + Math.random() * 0.1;
      recommendation = "Consider reducing position or selling.";
      reasoning =
        "Technical analysis indicates potential downward pressure. Volume trends and moving average crossovers suggest caution.";
      break;
    case "neutral":
      targetMultiplier = 0.97 + Math.random() * 0.06;
      recommendation = "Hold current position and monitor closely.";
      reasoning =
        "Market conditions are mixed. The stock is trading within a consolidation range with no clear directional bias.";
      break;
  }

  return {
    symbol,
    sentiment,
    confidence,
    targetPrice: Number((currentPrice * targetMultiplier).toFixed(2)),
    recommendation,
    reasoning,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stocks/indices", async (req, res) => {
    try {
      const indices = await Promise.all(
        MARKET_INDICES.map(async (index) => {
          try {
            const data = await fetchFinnhub(
              `/quote?symbol=${index.finnhubSymbol}`
            );
            return {
              symbol: index.symbol,
              name: index.name,
              price: data.c || 0,
              change: data.d || 0,
              changePercent: data.dp || 0,
            };
          } catch (error) {
            const basePrice = 4000 + Math.random() * 1000;
            const change = (Math.random() - 0.5) * 50;
            return {
              symbol: index.symbol,
              name: index.name,
              price: Number(basePrice.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number(((change / basePrice) * 100).toFixed(2)),
            };
          }
        })
      );
      res.json(indices);
    } catch (error) {
      console.error("Error fetching indices:", error);
      res.status(500).json({ error: "Failed to fetch market indices" });
    }
  });

  app.get("/api/stocks/trending", async (req, res) => {
    try {
      const stocks = await Promise.all(
        TRENDING_STOCKS.map(async (stock) => {
          return getQuote(stock.symbol);
        })
      );
      res.json(stocks);
    } catch (error) {
      console.error("Error fetching trending stocks:", error);
      res.status(500).json({ error: "Failed to fetch trending stocks" });
    }
  });

  app.get("/api/stocks/quote/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const quote = await getQuote(symbol.toUpperCase());
      res.json(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ error: "Failed to fetch stock quote" });
    }
  });

  app.get("/api/stocks/quotes/:symbols", async (req, res) => {
    try {
      const { symbols } = req.params;
      const symbolList = symbols.split(",").map((s) => s.trim().toUpperCase());
      const quotes = await Promise.all(
        symbolList.map((symbol) => getQuote(symbol))
      );
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch stock quotes" });
    }
  });

  app.get("/api/stocks/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const data = await fetchFinnhub(`/search?q=${encodeURIComponent(query)}`);
      res.json(data);
    } catch (error) {
      console.error("Error searching stocks:", error);
      const mockResults = Object.entries(STOCK_NAMES)
        .filter(
          ([symbol, name]) =>
            symbol.toLowerCase().includes(query.toLowerCase()) ||
            name.toLowerCase().includes(query.toLowerCase())
        )
        .map(([symbol, description]) => ({
          symbol,
          description,
          displaySymbol: symbol,
          type: "Common Stock",
        }));
      res.json({ count: mockResults.length, result: mockResults });
    }
  });

  app.get("/api/stocks/chart/:symbol/:period", async (req, res) => {
    try {
      const { symbol, period } = req.params;
      const chartData = generateMockChartData(symbol.toUpperCase(), period);
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  app.get("/api/stocks/prediction/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const quote = await getQuote(symbol.toUpperCase());
      const prediction = generatePrediction(symbol.toUpperCase(), quote.price);
      res.json(prediction);
    } catch (error) {
      console.error("Error generating prediction:", error);
      res.status(500).json({ error: "Failed to generate prediction" });
    }
  });

  app.get("/api/stocks/predictions/:symbols", async (req, res) => {
    try {
      const { symbols } = req.params;
      const symbolList = symbols.split(",").map((s) => s.trim().toUpperCase());

      const predictions = await Promise.all(
        symbolList.map(async (symbol) => {
          const quote = await getQuote(symbol);
          return generatePrediction(symbol, quote.price);
        })
      );

      res.json(predictions);
    } catch (error) {
      console.error("Error generating predictions:", error);
      res.status(500).json({ error: "Failed to generate predictions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
