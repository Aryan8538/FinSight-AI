import { env } from "../config/env.js";

const cache = new Map();
const demoCompanies = [
  { symbol: "AAPL", description: "Apple Inc." },
  { symbol: "MSFT", description: "Microsoft Corporation" },
  { symbol: "NVDA", description: "NVIDIA Corporation" },
  { symbol: "AMZN", description: "Amazon.com Inc." },
  { symbol: "GOOGL", description: "Alphabet Inc." },
  { symbol: "META", description: "Meta Platforms Inc." },
  { symbol: "TSLA", description: "Tesla Inc." },
  { symbol: "SPY", description: "SPDR S&P 500 ETF Trust" }
];

const basePrices = { AAPL: 198.42, MSFT: 472.11, NVDA: 143.85, AMZN: 214.36, GOOGL: 176.22, META: 697.71, TSLA: 322.05, SPY: 603.14 };

function cached(key, producer) {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.value);
  return producer().then((value) => {
    cache.set(key, { value, expiresAt: Date.now() + env.marketCacheSeconds * 1000 });
    return value;
  });
}

async function finnhub(path, params = {}) {
  const query = new URLSearchParams({ ...params, token: env.finnhubApiKey });
  const response = await fetch(`https://finnhub.io/api/v1${path}?${query}`);
  if (!response.ok) throw new Error(`Market provider returned ${response.status}`);
  return response.json();
}

function demoQuote(symbol) {
  const base = basePrices[symbol] || 100 + (symbol.charCodeAt(0) % 70);
  const drift = ((new Date().getMinutes() % 11) - 5) / 100;
  const price = Number((base * (1 + drift)).toFixed(2));
  return {
    symbol,
    companyName: demoCompanies.find((item) => item.symbol === symbol)?.description || symbol,
    price,
    change: Number((price - base).toFixed(2)),
    changePercent: Number((((price - base) / base) * 100).toFixed(2)),
    high: Number((price * 1.012).toFixed(2)),
    low: Number((price * 0.986).toFixed(2)),
    open: base,
    previousClose: base,
    marketCap: null,
    volume: null,
    source: "demo",
    timestamp: new Date().toISOString()
  };
}

export async function searchSymbols(query) {
  if (!query) return [];
  if (!env.finnhubApiKey) {
    const normalized = query.toLowerCase();
    return demoCompanies
      .filter((item) => item.symbol.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized))
      .slice(0, 8);
  }
  try {
    const data = await cached(`search:${query}`, () => finnhub("/search", { q: query }));
    return (data.result || []).filter((item) => ["Common Stock", "ETP"].includes(item.type)).slice(0, 10);
  } catch (error) {
    console.warn(`Finnhub search symbols failed for query "${query}", falling back to demo search. Error: ${error.message}`);
    const normalized = query.toLowerCase();
    return demoCompanies
      .filter((item) => item.symbol.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized))
      .slice(0, 8);
  }
}

export async function getQuote(rawSymbol) {
  const symbol = rawSymbol.toUpperCase();
  if (!env.finnhubApiKey) return demoQuote(symbol);
  return cached(`quote:${symbol}`, async () => {
    try {
      const [quote, profile] = await Promise.all([
        finnhub("/quote", { symbol }),
        finnhub("/stock/profile2", { symbol })
      ]);
      return {
        symbol,
        companyName: profile.name || symbol,
        price: quote.c,
        change: quote.d,
        changePercent: quote.dp,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        previousClose: quote.pc,
        marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1_000_000 : null,
        volume: null,
        source: "finnhub",
        timestamp: new Date((quote.t || Date.now() / 1000) * 1000).toISOString()
      };
    } catch (error) {
      console.warn(`Finnhub quote fetch failed for ${symbol}, falling back to demo data. Error: ${error.message}`);
      return demoQuote(symbol);
    }
  });
}

export async function getHistory(rawSymbol, range = "1M") {
  const symbol = rawSymbol.toUpperCase();
  
  if (env.finnhubApiKey) {
    try {
      const nowSeconds = Math.floor(Date.now() / 1000);
      let fromSeconds;
      let resolution = "D";
      
      switch (range) {
        case "1D":
          fromSeconds = nowSeconds - 24 * 60 * 60;
          resolution = "60";
          break;
        case "1W":
          fromSeconds = nowSeconds - 7 * 24 * 60 * 60;
          resolution = "60";
          break;
        case "1M":
          fromSeconds = nowSeconds - 30 * 24 * 60 * 60;
          resolution = "D";
          break;
        case "3M":
          fromSeconds = nowSeconds - 90 * 24 * 60 * 60;
          resolution = "D";
          break;
        case "1Y":
          fromSeconds = nowSeconds - 365 * 24 * 60 * 60;
          resolution = "W";
          break;
        default:
          fromSeconds = nowSeconds - 30 * 24 * 60 * 60;
          resolution = "D";
      }

      const data = await cached(`history:${symbol}:${range}`, () => 
        finnhub("/stock/candle", {
          symbol,
          resolution,
          from: fromSeconds,
          to: nowSeconds
        })
      );
      
      if (data && data.s === "ok" && Array.isArray(data.c)) {
        return data.c.map((closePrice, index) => ({
          date: new Date((data.t[index] || nowSeconds) * 1000).toISOString(),
          close: Number(closePrice.toFixed(2))
        }));
      }
    } catch (error) {
      console.warn(`Finnhub history fetch failed for ${symbol}, falling back to demo history. Error: ${error.message}`);
    }
  }

  // Fallback to demo history
  const points = { "1D": 24, "1W": 35, "1M": 30, "3M": 60, "1Y": 52 }[range] || 30;
  const base = (await getQuote(symbol)).price || 100;
  const now = Date.now();
  return Array.from({ length: points }, (_, index) => {
    const progress = index / Math.max(points - 1, 1);
    const wave = Math.sin(index * 0.72) * base * 0.018;
    const trend = (progress - 0.5) * base * 0.08;
    return {
      date: new Date(now - (points - index - 1) * 24 * 60 * 60 * 1000).toISOString(),
      close: Number((base + wave + trend).toFixed(2))
    };
  });
}

