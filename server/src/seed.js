import { connectDatabase } from "./config/db.js";
import LearningModule from "./models/LearningModule.js";

const modules = [
  {
    slug: "investing-101",
    title: "Investing 101",
    category: "Investing",
    summary: "Understand stocks, bonds, funds, returns, and the role of time.",
    readMinutes: 8,
    content: [
      { heading: "Why people invest", body: "Investing means putting money into assets that may grow or produce income. Unlike saving, the value can move up and down." },
      { heading: "Common building blocks", body: "Stocks represent ownership, bonds represent lending, and funds bundle many investments into one product." }
    ],
    takeaways: ["Match investments to your time horizon.", "Diversification reduces dependence on one asset.", "Fees compound too, so compare them carefully."],
    quiz: [
      { question: "What does a stock represent?", options: ["A loan to a company", "Ownership in a company", "A guaranteed return", "A savings account"], correctIndex: 1, explanation: "A share of stock is a small ownership interest in a company." },
      { question: "Why use a diversified fund?", options: ["To guarantee profit", "To avoid all fees", "To spread risk", "To trade every day"], correctIndex: 2, explanation: "Diversification spreads exposure across multiple assets." }
    ]
  },
  {
    slug: "budgeting-and-saving",
    title: "Budgeting Without the Guilt",
    category: "Money Basics",
    summary: "Build a flexible student budget, emergency buffer, and savings habit.",
    readMinutes: 6,
    content: [
      { heading: "Give money a job", body: "A budget is a plan, not a punishment. Start with income, essential costs, flexible spending, and future-you money." },
      { heading: "The 50/30/20 guide", body: "This rule is a starting point, not a test. Student budgets often need different percentages." }
    ],
    takeaways: ["Track the big categories first.", "Automate a small transfer on payday.", "Build a starter emergency fund before taking investment risk."],
    quiz: [
      { question: "What is the main purpose of a budget?", options: ["Eliminate all fun", "Plan how money supports priorities", "Predict stocks", "Increase credit limits"], correctIndex: 1, explanation: "A budget connects available money to current needs and future goals." }
    ]
  },
  {
    slug: "credit-and-debt",
    title: "Credit, Debt & Student Loans",
    category: "Credit",
    summary: "Learn what affects credit, how interest works, and how to compare debt.",
    readMinutes: 9,
    content: [
      { heading: "Credit scores", body: "Payment history and credit utilization are major factors. Paying on time matters more than clever hacks." },
      { heading: "Debt cost", body: "APR helps compare borrowing costs. Minimum payments can stretch repayment and increase total interest." }
    ],
    takeaways: ["Pay on time.", "Keep revolving balances manageable.", "Compare total repayment cost, not only the monthly payment."],
    quiz: [
      { question: "Which habit usually helps credit most?", options: ["Opening many cards", "Paying bills on time", "Carrying a balance", "Ignoring statements"], correctIndex: 1, explanation: "Consistent on-time payment history is a core credit factor." }
    ]
  },
  {
    slug: "student-tax-basics",
    title: "Tax Basics for Students",
    category: "Taxes",
    summary: "A practical overview of income, withholding, forms, and filing.",
    readMinutes: 7,
    content: [
      { heading: "Income and withholding", body: "Your paycheck may have taxes withheld. Filing reconciles what you paid with what you actually owe." },
      { heading: "Keep records", body: "Save tax forms and receipts for eligible education expenses. Rules change, so use current official guidance." }
    ],
    takeaways: ["Do not ignore tax forms.", "Use current government guidance.", "Ask a qualified preparer when your situation is complex."],
    quiz: [
      { question: "Why file a tax return?", options: ["To open a bank account", "To reconcile taxes paid and owed", "To set a credit score", "To choose investments"], correctIndex: 1, explanation: "Filing determines whether you owe more tax or may receive a refund." }
    ]
  },
  {
    slug: "risk-and-diversification",
    title: "Risk & Diversification",
    category: "Investing",
    summary: "Connect volatility, time horizon, goals, and asset allocation.",
    readMinutes: 8,
    content: [
      { heading: "Risk has many forms", body: "Prices can fluctuate, inflation can erode purchasing power, and concentration can magnify company-specific problems." },
      { heading: "Diversification", body: "Holding different assets can reduce the impact of any single investment, but it cannot eliminate market risk." }
    ],
    takeaways: ["Risk capacity and risk comfort are different.", "Longer time horizons can tolerate more fluctuation.", "Rebalancing restores your intended mix."],
    quiz: [
      { question: "What can diversification do?", options: ["Eliminate all losses", "Reduce concentration risk", "Guarantee returns", "Predict the market"], correctIndex: 1, explanation: "Diversification can reduce dependence on a single investment, not eliminate all risk." }
    ]
  }
];

async function seed() {
  await connectDatabase();
  await Promise.all(
    modules.map((module) => LearningModule.findOneAndUpdate({ slug: module.slug }, module, { upsert: true, new: true }))
  );
  console.log(`Seeded ${modules.length} learning modules`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
