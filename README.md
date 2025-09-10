# x402-CryptoPriceConverter

An Express.js API powered by [Coinbase’s x402 protocol]([url](https://docs.cdp.coinbase.com/x402/bazaar)) that provides real-time cryptocurrency and stock prices with built-in micropayments in USDC on Base. Discoverable in x402 Bazaar for AI agents and developers.

## Features

- /api/crypto → Fetch real-time crypto prices (via CoinGecko).
- /api/stock → Fetch real-time US stock prices (via Yahoo Finance).
- x402 Paywall → Every request is protected by Coinbase’s x402-express middleware.
- Discoverable → APIs are automatically listed in x402 Bazaar (discoverable: true).
- Pay-per-call model → Agents or devs can pay small amounts in USDC to use your endpoints.
