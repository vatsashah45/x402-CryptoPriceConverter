# x402-CryptoPriceConverter

An Express.js API powered by [Coinbase’s x402 protocol](https://docs.cdp.coinbase.com/x402/bazaar) that provides **real-time cryptocurrency prices, stock prices, and sentiment data** with built-in micropayments in **USDC on Base**.  
APIs are **discoverable in x402 Bazaar** for AI agents and developers.

---

- x402 Paywall → Every request is protected by Coinbase’s x402-express middleware.
- Discoverable → APIs are automatically listed in x402 Bazaar (discoverable: true).
- Pay-per-call model → Agents or devs can pay small amounts in USDC to use the endpoints.

--- 

## Features

- **`/api/crypto`** → Fetch real-time crypto prices (via CoinGecko).  
  Example: `GET /api/crypto?symbol=BTC&currency=USD`

- **`/api/stock`** → Fetch real-time US stock prices (via Yahoo Finance).  
  Example: `GET /api/stock?symbol=AAPL`

- **`/api/sentiment`** → Get the Crypto Fear & Greed Index (market sentiment).  
  Example: `GET /api/sentiment?symbol=BTC`  
  Returns:
  ```json
  {
    "symbol": "BTC",
    "score": 67,
    "sentiment": "Greed",
    "timestamp": "2025-09-14T12:00:00Z"
  }
