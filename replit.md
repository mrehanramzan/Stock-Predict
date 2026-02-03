# StockPredict - Stock Price Prediction App

## Overview
A mobile app for tracking stock prices and getting AI-powered predictions. Built with React Native (Expo) and Express.js backend.

## Architecture

### Frontend (client/)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation 7 with bottom tabs
- **State Management**: TanStack React Query for server state, AsyncStorage for local persistence
- **Styling**: Theme-based design system in constants/theme.ts

### Backend (server/)
- **Framework**: Express.js
- **API**: RESTful endpoints for stock data
- **Data Source**: Finnhub API for real-time stock quotes (falls back to mock data)

## Key Features
1. **Markets Screen**: Market indices overview, trending stocks
2. **Watchlist Screen**: Track favorite stocks locally
3. **Stock Detail Screen**: Price charts, AI predictions
4. **Insights Screen**: Portfolio-wide AI predictions summary
5. **Search Modal**: Search and add stocks to watchlist

## Project Structure
```
client/
├── components/     # Reusable UI components
├── constants/      # Theme, colors, spacing
├── hooks/          # Custom React hooks
├── lib/            # Utilities (query-client, storage)
├── navigation/     # Navigation structure
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
- `GET /api/stocks/quotes/:symbols` - Multiple stock quotes (comma-separated)
- `GET /api/stocks/search/:query` - Search stocks
- `GET /api/stocks/chart/:symbol/:period` - Historical chart data
- `GET /api/stocks/prediction/:symbol` - AI prediction for a stock
- `GET /api/stocks/predictions/:symbols` - Multiple predictions

## Environment Variables
- `FINNHUB_API_KEY` - Optional: Finnhub API key for real data (uses demo/mock without it)

## Development
- Frontend runs on port 8081 (Expo)
- Backend runs on port 5000 (Express)
- Use `npm run server:dev` to start backend
- Use `npm run expo:dev` to start frontend
