# x402-CryptoPriceConverter

An Express.js API that provides **real-time cryptocurrency prices, stock prices, and sentiment data**. Each endpoint requires a small USDC payment on Base mainnet per request.

---

## Setup

### Prerequisites

- Node.js 18+
- A Base mainnet wallet address to receive USDC payments

### Installation

```bash
git clone https://github.com/vatsashah45/x402-CryptoPriceConverter.git
cd x402-CryptoPriceConverter
npm install
```

### Environment

Create a `.env` file in the project root:

```env
PAY_TO_ADDRESS=0xYourWalletAddressHere

# Testnet (default if not set)
FACILITATOR_URL=https://x402.org/facilitator

# Mainnet
# FACILITATOR_URL=https://api.cdp.coinbase.com/platform/v2/x402
```

### Run

```bash
npm start
# API running on http://localhost:3000
```

---

## API Endpoints

### `GET /api/crypto` — Crypto Prices ($0.001 USDC)

Fetch the current price of a cryptocurrency in any fiat currency.

**Query Parameters**

| Parameter | Required | Default | Description |
|---|---|---|---|
| `symbol` | No | `bitcoin` | CoinGecko coin ID (e.g. `bitcoin`, `ethereum`) |
| `currency` | No | `USD` | Fiat currency code (e.g. `USD`, `EUR`) |

**Example**

```
GET /api/crypto?symbol=bitcoin&currency=USD
```

```json
{
  "symbol": "BITCOIN",
  "currency": "USD",
  "price": 65432.10,
  "timestamp": "2025-09-14T12:00:00Z"
}
```

---

### `GET /api/stock` — Stock Prices ($0.005 USDC)

Fetch the current price of a US-listed stock.

**Query Parameters**

| Parameter | Required | Default | Description |
|---|---|---|---|
| `symbol` | No | `AAPL` | Stock ticker symbol (e.g. `AAPL`, `TSLA`) |

**Example**

```
GET /api/stock?symbol=AAPL
```

```json
{
  "symbol": "AAPL",
  "price": 189.50,
  "currency": "USD",
  "timestamp": "2025-09-14T12:00:00Z"
}
```

---

### `GET /api/sentiment` — Bitcoin Fear & Greed Index ($0.003 USDC)

Fetch the current Bitcoin Fear & Greed Index score. Only `BTC` is supported.

**Query Parameters**

| Parameter | Required | Default | Description |
|---|---|---|---|
| `symbol` | No | `BTC` | Must be `BTC` |

**Example**

```
GET /api/sentiment?symbol=BTC
```

```json
{
  "symbol": "BTC",
  "score": 67,
  "classification": "Greed",
  "timestamp": "2025-09-14T12:00:00Z"
}
```

---

### `GET /` — Discovery endpoint (free)

Returns the list of available endpoints with their pricing and network details. Responds to the `Accept: application/x402+json` header.

**Example**

```
GET /
Accept: application/x402+json
```

```json
{
  "x402Version": 2,
  "resources": [
    {
      "path": "/api/crypto",
      "description": "Get real-time crypto prices (BTC, ETH, etc.)",
      "accepts": { "scheme": "exact", "price": "$0.001", "network": "eip155:8453", "payTo": "0x..." }
    },
    {
      "path": "/api/stock",
      "description": "Get real-time US stock prices (AAPL, TSLA, etc.)",
      "accepts": { "scheme": "exact", "price": "$0.005", "network": "eip155:8453", "payTo": "0x..." }
    },
    {
      "path": "/api/sentiment",
      "description": "Get the daily Bitcoin Fear & Greed Index (sentiment score)",
      "accepts": { "scheme": "exact", "price": "$0.003", "network": "eip155:8453", "payTo": "0x..." }
    }
  ]
}
```
