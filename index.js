import express from "express";
import axios from "axios";
import { paymentMiddleware } from "x402-express";

const app = express();

// 🔑 Replace with your own wallet address where USDC should be sent
const payToAddress = "0xYourWalletAddressHere";

app.use(
  paymentMiddleware(
    payToAddress,
    {
      "/api/crypto": {
        price: "$0.002",
        network: "base",
        config: {
          description: "Get real-time crypto prices (BTC, ETH, etc.)",
          outputSchema: {
            type: "object",
            properties: {
              symbol: { type: "string" },
              currency: { type: "string" },
              price: { type: "number" },
              timestamp: { type: "string" },
            },
          },
        },
      },
      "/api/stock": {
        price: "$0.005",
        network: "base",
        config: {
          description: "Get real-time US stock prices (AAPL, TSLA, etc.)",
          outputSchema: {
            type: "object",
            properties: {
              symbol: { type: "string" },
              price: { type: "number" },
              currency: { type: "string" },
              timestamp: { type: "string" },
            },
          },
        },
      },
    }
  )
);

app.get("/api/crypto", async (req, res) => {
  try {
    const { symbol = "BTC", currency = "USD" } = req.query;
    const resp = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=${currency.toLowerCase()}`
    );
    const price = resp.data[symbol.toLowerCase()][currency.toLowerCase()];
    res.json({
      symbol: symbol.toUpperCase(),
      currency: currency.toUpperCase(),
      price,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Error fetching crypto price" });
  }
});

app.get("/api/stock", async (req, res) => {
  try {
    const { symbol = "AAPL" } = req.query;
    const resp = await axios.get(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`
    );
    const result = resp.data.quoteResponse.result[0];
    res.json({
      symbol: result.symbol,
      price: result.regularMarketPrice,
      currency: result.currency,
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Error fetching stock price" });
  }
});

app.get("/", (req, res) => {
  res.send("x402 Price API is running ✅");
});

app.listen(3000, () => {
  console.log("x402 Price API running on http://localhost:3000");
});
