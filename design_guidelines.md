# Stock Prediction App - Design Guidelines

## Brand Identity

**Aesthetic Direction**: Confident & Approachable Financial
- Professional data-driven interface without corporate stuffiness
- Trust through clarity, not formality
- Clean data visualization with breathing room
- Memorable element: Gradient-accented prediction cards with smooth animations

**Purpose**: Democratize stock market insights by making predictions accessible and understandable for everyday investors.

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs + FAB)
- **Markets** - Browse trending stocks, market overview
- **Watchlist** - User's tracked stocks
- **Search** (FAB) - Core action for adding stocks
- **Insights** - AI predictions and analysis
- **Profile** - Settings and preferences

## Screen Specifications

### 1. Markets Screen
- **Purpose**: Discover trending stocks and market movers
- **Header**: Transparent, title "Markets", search icon (right)
- **Layout**: ScrollView with safe area top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**: 
  - Market summary cards (S&P 500, NASDAQ, DOW)
  - "Top Movers" horizontal scroll
  - "Trending" vertical list of stock cards
  - Empty state: empty-markets.png if API fails
- Stock cards show: ticker, company name, current price, % change with color coding

### 2. Watchlist Screen
- **Purpose**: Monitor saved stocks
- **Header**: Transparent, title "Watchlist", filter icon (right)
- **Layout**: FlatList, safe area top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**: Stock cards with price charts, pull-to-refresh
- **Empty State**: empty-watchlist.png with "Add stocks to track" message

### 3. Search Modal (FAB)
- **Purpose**: Search and add stocks
- **Presentation**: Full-screen modal
- **Header**: Custom with close button (left), "Search Stocks" title
- **Layout**: Search bar at top, results FlatList below
- **Components**: Search input, stock result cards with "Add" button

### 4. Stock Detail Screen
- **Purpose**: View detailed stock info and predictions
- **Header**: Default navigation with stock ticker as title, watchlist toggle (right)
- **Layout**: ScrollView, safe area top: Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Components**:
  - Large price display with 24h change
  - Interactive chart (1D, 1W, 1M, 1Y tabs)
  - "AI Prediction" card with confidence percentage
  - Company info section
  - News feed (if available)

### 5. Insights Screen
- **Purpose**: View AI predictions across portfolio
- **Header**: Transparent, title "Insights"
- **Layout**: ScrollView, safe area top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**:
  - "Predictions Summary" card
  - List of stocks with prediction badges (Bullish/Bearish/Neutral)
  - Risk indicators

### 6. Profile Screen
- **Purpose**: User settings and preferences
- **Header**: Transparent, title "Profile"
- **Layout**: ScrollView with sections, safe area top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Avatar (generated preset) and name field
  - Settings: Theme toggle, notification preferences
  - About section with app version

## Color Palette

**Primary**: #2563EB (Deep Blue) - Trust and stability
**Accent**: #10B981 (Emerald Green) - Positive growth
**Danger**: #EF4444 (Red) - Losses/alerts
**Background**: #F9FAFB (Light mode), #111827 (Dark mode)
**Surface**: #FFFFFF (Light), #1F2937 (Dark)
**Text Primary**: #111827 (Light), #F9FAFB (Dark)
**Text Secondary**: #6B7280 (Light), #9CA3AF (Dark)
**Border**: #E5E7EB (Light), #374151 (Dark)

Positive/negative changes use Accent/Danger colors respectively.

## Typography

**Font**: System font (SF Pro for iOS, Roboto for Android)
**Scale**:
- Display: 28pt, Bold (stock prices)
- Title: 20pt, Semibold (screen headers)
- Headline: 17pt, Semibold (card titles)
- Body: 15pt, Regular (descriptions)
- Caption: 13pt, Regular (metadata, timestamps)

## Visual Design

- Stock cards have subtle borders, no shadows
- Floating Search FAB has drop shadow: offset (0, 2), opacity 0.10, radius 2
- Chart lines use Primary color with gradient fill below
- All buttons have pressed state with 0.6 opacity
- Success states use Accent color with checkmark icon
- Price changes animate on update

## Assets to Generate

1. **icon.png** - App icon showing stylized upward trending arrow with gradient
2. **splash-icon.png** - Same as icon but optimized for splash screen
3. **empty-watchlist.png** - Illustration of empty chart/graph with magnifying glass, used in Watchlist screen when no stocks added
4. **empty-markets.png** - Illustration of loading/error state, used in Markets screen on API failure
5. **avatar-preset.png** - Default user avatar (geometric investor icon), used in Profile screen

All illustrations use Primary/Accent color scheme with minimal line-art style.