import { AppError, asyncHandler, ok } from "../utils/http.js";
import User from "../models/User.js";
import { getHistory, getQuote, searchSymbols } from "../services/marketService.js";

export const search = asyncHandler(async (req, res) => ok(res, { results: await searchSymbols(req.query.q || "") }));

export const quote = asyncHandler(async (req, res) => ok(res, { quote: await getQuote(req.params.symbol) }));

export const history = asyncHandler(async (req, res) =>
  ok(res, { symbol: req.params.symbol.toUpperCase(), range: req.query.range || "1M", points: await getHistory(req.params.symbol, req.query.range) })
);

export const watchlist = asyncHandler(async (req, res) => {
  const quotes = await Promise.all(req.user.watchlist.map(getQuote));
  return ok(res, { symbols: req.user.watchlist, quotes });
});

export const addWatchlist = asyncHandler(async (req, res) => {
  const symbol = String(req.params.symbol).toUpperCase();
  if (!/^[A-Z.-]{1,10}$/.test(symbol)) throw new AppError(400, "Invalid ticker symbol");
  await User.updateOne({ _id: req.user._id }, { $addToSet: { watchlist: symbol } });
  req.user.watchlist = [...new Set([...req.user.watchlist, symbol])];
  return ok(res, { watchlist: req.user.watchlist });
});

export const removeWatchlist = asyncHandler(async (req, res) => {
  const symbol = String(req.params.symbol).toUpperCase();
  await User.updateOne({ _id: req.user._id }, { $pull: { watchlist: symbol } });
  req.user.watchlist = req.user.watchlist.filter((item) => item !== symbol);
  return ok(res, { watchlist: req.user.watchlist });
});

