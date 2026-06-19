import { z } from "zod";
import Portfolio from "../models/Portfolio.js";
import { getQuote } from "../services/marketService.js";
import { AppError, asyncHandler, ok } from "../utils/http.js";

export const createPortfolioSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).optional().default("")
});

export const holdingSchema = z.object({
  symbol: z.string().trim().min(1).max(10).transform((value) => value.toUpperCase()),
  companyName: z.string().trim().max(120).optional().default(""),
  quantity: z.coerce.number().positive(),
  purchasePrice: z.coerce.number().nonnegative(),
  purchaseDate: z.coerce.date()
});

async function ownedPortfolio(userId, portfolioId) {
  const portfolio = await Portfolio.findOne({ _id: portfolioId, user: userId });
  if (!portfolio) throw new AppError(404, "Portfolio not found");
  return portfolio;
}

async function enrich(portfolio) {
  const quotes = await Promise.all(portfolio.holdings.map((holding) => getQuote(holding.symbol)));
  const holdings = portfolio.holdings.map((holding, index) => {
    const currentPrice = quotes[index]?.price || holding.purchasePrice;
    const costBasis = holding.quantity * holding.purchasePrice;
    const marketValue = holding.quantity * currentPrice;
    return {
      ...holding.toObject(),
      currentPrice,
      costBasis,
      marketValue,
      gainLoss: marketValue - costBasis,
      gainLossPercent: costBasis ? ((marketValue - costBasis) / costBasis) * 100 : 0
    };
  });
  const totalValue = holdings.reduce((sum, item) => sum + item.marketValue, 0);
  const totalCost = holdings.reduce((sum, item) => sum + item.costBasis, 0);
  return {
    ...portfolio.toObject(),
    holdings,
    metrics: {
      totalValue,
      totalCost,
      gainLoss: totalValue - totalCost,
      gainLossPercent: totalCost ? ((totalValue - totalCost) / totalCost) * 100 : 0
    }
  };
}

export const list = asyncHandler(async (req, res) => {
  const portfolios = await Portfolio.find({ user: req.user._id }).sort({ createdAt: -1 });
  return ok(res, { portfolios: await Promise.all(portfolios.map(enrich)) });
});

export const getOne = asyncHandler(async (req, res) => ok(res, { portfolio: await enrich(await ownedPortfolio(req.user._id, req.params.id)) }));

export const create = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.create({ ...req.body, user: req.user._id });
  return ok(res, { portfolio: await enrich(portfolio) }, 201);
});

export const remove = asyncHandler(async (req, res) => {
  const portfolio = await ownedPortfolio(req.user._id, req.params.id);
  await portfolio.deleteOne();
  return ok(res, { deleted: true });
});

export const addHolding = asyncHandler(async (req, res) => {
  const portfolio = await ownedPortfolio(req.user._id, req.params.id);
  portfolio.holdings.push(req.body);
  await portfolio.save();
  return ok(res, { portfolio: await enrich(portfolio) }, 201);
});

export const updateHolding = asyncHandler(async (req, res) => {
  const portfolio = await ownedPortfolio(req.user._id, req.params.id);
  const holding = portfolio.holdings.id(req.params.holdingId);
  if (!holding) throw new AppError(404, "Holding not found");
  Object.assign(holding, req.body);
  await portfolio.save();
  return ok(res, { portfolio: await enrich(portfolio) });
});

export const removeHolding = asyncHandler(async (req, res) => {
  const portfolio = await ownedPortfolio(req.user._id, req.params.id);
  const holding = portfolio.holdings.id(req.params.holdingId);
  if (!holding) throw new AppError(404, "Holding not found");
  holding.deleteOne();
  await portfolio.save();
  return ok(res, { portfolio: await enrich(portfolio) });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const portfolio = await enrich(await ownedPortfolio(req.user._id, req.params.id));
  const rows = [
    ["Symbol", "Company", "Quantity", "Purchase Price", "Current Price", "Cost Basis", "Market Value", "Gain/Loss"],
    ...portfolio.holdings.map((h) => [h.symbol, h.companyName, h.quantity, h.purchasePrice, h.currentPrice, h.costBasis, h.marketValue, h.gainLoss])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${portfolio.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.csv"`);
  res.send(csv);
});

