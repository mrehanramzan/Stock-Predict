# StockPredict - Stock Price Prediction App

## Overview
A beautiful mobile app for tracking stock prices and getting AI-powered predictions. Features login/signup, portfolio tracking, watchlists, and smart insights.

## Features
- **Authentication**: Login and signup with local storage
- **Markets Dashboard**: Portfolio overview, performance cards, market indices, trending stocks
- **Watchlist**: Track favorite stocks with real-time prices
- **AI Insights**: Sentiment analysis, predictions with confidence scores
- **Stock Details**: Interactive charts, price data, AI predictions

## Architecture

### Frontend (client/)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation 7 with bottom tabs (Markets, Watchlist, Insights, Profile)
- **State Management**: TanStack React Query for server state, AsyncStorage for auth and watchlist
- **Styling**: Theme-based design system with light/dark mode support

### Backend (server/)
- **Framework**: Express.js
- **API**: RESTful endpoints for stock data
- **Data Source**: Finnhub API with fallback to mock data

## Project Structure
```
client/
├── components/     # UI components (StockCard, PriceChart, etc.)
├── constants/      # Theme with colors, spacing, typography
├── hooks/          # Custom hooks (useAuth, useStockData, useTheme)
├── lib/            # Utilities (query-client, storage, auth)
├── navigation/     # Navigation structure (tabs, stacks)
├── screens/        # Screen components
└── types/          # TypeScript types

server/
├── index.ts        # Express server setup
└── routes.ts       # API endpoints
```

## API Endpoints
- `GET /api/stocks/indices` - Market indices (S&P 500, Dow, NASDAQ)
- `GET /api/stocks/trending` - Trending stocks list
- `GET /api/stocks/quote/:symbol` - Single stock quote
- `GET /api/stocks/quotes/:symbols` - Multiple stock quotes
- `GET /api/stocks/search/:query` - Search stocks
- `GET /api/stocks/chart/:symbol/:period` - Historical chart data
- `GET /api/stocks/prediction/:symbol` - AI prediction for a stock
- `GET /api/stocks/predictions/:symbols` - Multiple predictions

## Environment Variables
- `FINNHUB_API_KEY` - Optional: Finnhub API key for real data

## Development
- Frontend runs on port 8081 (Expo)
- Backend runs on port 5000 (Express)
- `npm run server:dev` - Start backend
- `npm run expo:dev` - Start frontend
