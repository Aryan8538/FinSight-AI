import test from "node:test";
import assert from "node:assert/strict";
import { askAdvisor } from "../src/services/aiService.js";

const dummyUser = {
  profile: {
    experience: "beginner",
    riskTolerance: "balanced",
    goals: ["build savings", "learn index funds"]
  }
};

const dummyPortfolios = [
  {
    name: "Growth Pool",
    holdings: [
      { symbol: "AAPL", quantity: 10, purchasePrice: 150, purchaseDate: new Date() }
    ]
  }
];

test("Advisor returns a relevant index fund response when queried", async () => {
  const result = await askAdvisor({
    message: "What is an index fund and how does it work?",
    history: [],
    user: dummyUser,
    portfolios: dummyPortfolios
  });

  assert.equal(result.provider, "demo");
  assert.match(result.content, /Understanding Index Funds & ETFs/i);
  assert.match(result.content, /AAPL \(10 shares in your "Growth Pool" portfolio\)/);
  assert.match(result.content, /beginner/);
});

test("Advisor returns budgeting advice when budgeting is queried", async () => {
  const result = await askAdvisor({
    message: "Help me create a student budget",
    history: [],
    user: dummyUser,
    portfolios: []
  });

  assert.equal(result.provider, "demo");
  assert.match(result.content, /Smart Budgeting & Emergency Savings/i);
  assert.match(result.content, /50\/30\/20 Rule/);
  assert.match(result.content, /Emergency Savings Buffer/i);
});

test("Advisor returns portfolio guidance when portfolio is queried", async () => {
  const result = await askAdvisor({
    message: "Tell me about my holdings",
    history: [],
    user: dummyUser,
    portfolios: dummyPortfolios
  });

  assert.equal(result.provider, "demo");
  assert.match(result.content, /Your Portfolio & Asset Allocation/i);
  assert.match(result.content, /AAPL/);
});

test("Advisor returns default response for general queries", async () => {
  const result = await askAdvisor({
    message: "Hello, who are you?",
    history: [],
    user: dummyUser,
    portfolios: []
  });

  assert.equal(result.provider, "demo");
  assert.match(result.content, /Welcome to FinSight AI Financial Education/i);
});
