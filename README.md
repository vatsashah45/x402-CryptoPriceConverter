# x402-CryptoPriceConverter

An Express.js API powered by [Coinbase's x402 protocol](https://www.x402.org) that provides **real-time cryptocurrency prices, stock prices, and sentiment data** with built-in micropayments in **USDC on Base**.  
APIs are **discoverable in x402 Bazaar** for AI agents and developers.

---

## What's New — x402 v2

This project has been updated to use the **x402 v2 SDK**, which introduces a cleaner, more modular architecture:

| Change | Details |
|---|---|
| **Modular packages** | Split into `@x402/core`, `@x402/evm`, and `@x402/express` — install only what you need |
| **`x402ResourceServer`** | Central server object that registers payment schemes per chain via `.register()` |
| **`ExactEvmScheme`** | Pluggable EVM payment scheme for exact-amount USDC payments |
| **`HTTPFacilitatorClient`** | Connects to the x402.org facilitator for on-chain payment verification |
| **CAIP-2 Network IDs** | Chains identified by standardised CAIP-2 strings (e.g. `eip155:8453` for Base mainnet) |
| **Discovery endpoint** | `GET /` responds to `Accept: application/x402+json` with machine-readable resource metadata |
| **`x402Version: 2`** | All discovery responses advertise protocol version 2 |

---

## Features

| Endpoint | Price | Description |
|---|---|---|
| `GET /api/crypto` | $0.001 USDC | Real-time crypto prices via CoinGecko |
| `GET /api/stock` | $0.005 USDC | Real-time US stock prices via Yahoo Finance |
| `GET /api/sentiment` | $0.003 USDC | Bitcoin Fear & Greed Index |

### `/api/crypto`
Fetch real-time crypto prices.

```
GET /api/crypto?symbol=BTC&currency=USD
```

```json
{
  "symbol": "BTC",
  "currency": "USD",
  "price": 65432.10,
  "timestamp": "2025-09-14T12:00:00Z"
}
```

### `/api/stock`
Fetch real-time US stock prices.

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

### `/api/sentiment`
Get the Bitcoin Fear & Greed Index (BTC only).

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

### `/` — Discovery endpoint
Returns machine-readable resource metadata for x402-aware clients and AI agents.

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
      "accepts": { "scheme": "exact", "price": "$0.001", "network": "eip155:8453" }
    }
  ]
}
```

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
```

### Run

```bash
npm start
# API running on http://localhost:3000
```

---

## How It Works (x402 v2 Flow)

1. A client (or AI agent) sends a request to a protected endpoint.
2. The `paymentMiddleware` intercepts it and returns a **402 Payment Required** response with payment details.
3. The client constructs a signed USDC payment on Base mainnet and retries the request with an `X-Payment` header.
4. The `HTTPFacilitatorClient` verifies the payment via `https://x402.org/facilitator`.
5. On success, the response is returned to the caller.

---

## Tech Stack

- **[Express 5](https://expressjs.com/)** — HTTP server
- **[@x402/express v2](https://www.npmjs.com/package/@x402/express)** — x402 payment middleware
- **[@x402/core v2](https://www.npmjs.com/package/@x402/core)** — Core protocol types and facilitator client
- **[@x402/evm v2](https://www.npmjs.com/package/@x402/evm)** — EVM payment scheme (Base / USDC)
- **[CoinGecko API](https://www.coingecko.com/en/api)** — Crypto price data
- **[Yahoo Finance API](https://finance.yahoo.com)** — Stock price data
- **[Alternative.me Fear & Greed API](https://alternative.me/crypto/fear-and-greed-index/)** — Sentiment data
