import express from "express";
import axios from "axios";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const payToAddress = process.env.PAY_TO_ADDRESS;

if (!payToAddress) {
  throw new Error("PAY_TO_ADDRESS not set in .env file");
}

const facilitatorClient = new HTTPFacilitatorClient({ url: "https://x402.org/facilitator" });
const resourceServer = new x402ResourceServer(facilitatorClient)
  .register("eip155:8453", new ExactEvmScheme());

const routesConfig = {
  "GET /api/crypto": {
    accepts: {
      scheme: "exact",
      price: "$0.001",
      network: "eip155:8453",
      payTo: payToAddress,
    },
    description: "Get real-time crypto prices (BTC, ETH, etc.)",
  },
  "GET /api/stock": {
    accepts: {
      scheme: "exact",
      price: "$0.005",
      network: "eip155:8453",
      payTo: payToAddress,
    },
    description: "Get real-time US stock prices (AAPL, TSLA, etc.)",
  },
  "GET /api/sentiment": {
    accepts: {
      scheme: "exact",
      price: "$0.003",
      network: "eip155:8453",
      payTo: payToAddress,
    },
    description: "Get the daily Bitcoin Fear & Greed Index (sentiment score)",
  },
};

app.use(paymentMiddleware(routesConfig, resourceServer));

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

app.get("/api/sentiment", async (req, res) => {
  try {
    const { symbol = "BTC" } = req.query;

    if (symbol.toUpperCase() !== "BTC") {
      return res.status(400).json({
        error: "Sentiment data is only available for BTC at the moment.",
      });
    }

    const resp = await axios.get("https://api.alternative.me/fng/");
    const data = resp.data?.data?.[0];

    if (!data) {
      return res.status(500).json({ error: "No sentiment data available" });
    }

    res.json({
      symbol: "BTC",
      score: Number(data.value),
      classification: data.value_classification,
      timestamp: new Date(Number(data.timestamp) * 1000).toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Error fetching sentiment data" });
  }
});

app.get("/", (req, res) => {
  if (req.headers.accept === "application/x402+json") {
    return res.json({
      x402Version: 2,
      resources: Object.entries(routesConfig).map(([key, config]) => ({
        path: key.includes(" ") ? key.split(" ")[1] : key,
        description: config.description,
        accepts: config.accepts,
      })),
    });
  }

  res.send("x402 Price API is running");
});

app.listen(3000, () => {
  console.log("x402 Price API running on http://localhost:3000");
});
