import { env } from "../config/env.js";

const disclaimer =
  "FinSight AI provides financial education, not personalized investment, legal, or tax advice. Consider a qualified professional before making financial decisions.";

function systemPrompt(user, portfolios) {
  const portfolioSummary = portfolios
    .map((portfolio) => `${portfolio.name}: ${portfolio.holdings.map((h) => `${h.symbol} (${h.quantity} shares)`).join(", ") || "empty"}`)
    .join("; ");
  return `You are FinSight AI, a warm and careful financial educator for college students.
Explain concepts in plain language, define jargon, use concise examples, and give practical next steps.
Never guarantee returns, tell the user to buy or sell a specific security, or present regulated financial advice as certain.
When useful, recommend one learning topic from: investing basics, budgeting, credit and debt, student taxes, risk and diversification.
User profile: experience=${user.profile?.experience || "beginner"}, risk tolerance=${user.profile?.riskTolerance || "balanced"}, goals=${(user.profile?.goals || []).join(", ") || "not provided"}.
Paper portfolios: ${portfolioSummary || "none"}.
End substantive responses with a brief reminder that this is educational information, not financial advice.`;
}

function localFallbackResponder({ message, user, portfolios }) {
  const query = String(message || "").toLowerCase();

  // 1. Gather user profile context
  const exp = user.profile?.experience || "beginner";
  const risk = user.profile?.riskTolerance || "balanced";
  const goals = user.profile?.goals || [];
  const goalsStr = goals.length > 0 ? goals.join(", ") : "general financial education";

  const profileContext = `Based on your profile, you are currently an **${exp}** investor with a **${risk}** risk tolerance, working towards goals like **${goalsStr}**.`;

  // 2. Gather portfolios and holdings context
  let portfolioContext = "";
  if (portfolios && portfolios.length > 0) {
    const activeHoldings = [];
    portfolios.forEach((p) => {
      if (p.holdings && p.holdings.length > 0) {
        p.holdings.forEach((h) => {
          activeHoldings.push(`${h.symbol} (${h.quantity} shares in your "${p.name}" portfolio)`);
        });
      }
    });
    if (activeHoldings.length > 0) {
      portfolioContext = `I see you currently have paper portfolio holdings: ${activeHoldings.join(", ")}.`;
    } else {
      portfolioContext = "I see you have created a paper portfolio but haven't added holdings yet. Adding mock stock assets is a great way to practice risk-free!";
    }
  } else {
    portfolioContext = "I noticed you haven't created any paper portfolios yet. Try going to the **Portfolios** page to set up a mock portfolio and practice investing!";
  }

  // 3. Keyword categorization & dynamic response generation
  if (
    query.includes("portfolio") ||
    query.includes("holding") ||
    query.includes("my stock") ||
    query.includes("shares") ||
    query.includes("own")
  ) {
    return `### 📊 Your Portfolio & Asset Allocation

Here is a look at your paper portfolios:
- ${portfolioContext}

For a **${risk}** risk tolerance, here is some guidance on asset allocation:
${
  risk === "conservative"
    ? "1. **Focus on stability**: Consider higher allocation to bonds or short-term cash equivalents.\n2. **Lower volatility**: Diversifying across index funds can help buffer against stock drops."
    : risk === "growth"
    ? "1. **Higher equity exposure**: A growth profile typically allocates more to stocks, which can fluctuate in the short term but offer higher long-term growth.\n2. **Longer time horizon**: Make sure you don't need this capital in the next 3 to 5 years."
    : "1. **Balanced approach**: A mix of approximately 60% stocks (equities) and 40% bonds/cash is a classic balanced setup.\n2. **Growth + Protection**: This blends stock growth potential with bond income and stability."
}

**Next Steps & Lessons:**
- Try checking out the **Risk & Diversification** lesson to learn how to balance your assets.
- Export your portfolio holdings to CSV on the Portfolios page to analyze them.

${disclaimer}`;
  }

  if (query.includes("index fund") || query.includes("mutual fund") || query.includes("etf") || query.includes("fund")) {
    return `### 📈 Understanding Index Funds & ETFs

An **Index Fund** or **ETF (Exchange-Traded Fund)** is a basket of hundreds of different stocks or bonds bundled into a single security. Instead of buying individual shares of one company (like Apple or Tesla), you buy a tiny slice of many companies at once.

**Key concepts to keep in mind:**
1. **Instant Diversification:** Buying one share of an S&P 500 index fund gives you exposure to the 500 largest US companies, reducing the risk of a single company failing.
2. **Passive Management:** Instead of paying managers high fees to pick stocks, index funds simply track a market index, keeping costs (expense ratios) extremely low.
3. **Compound Growth:** Perfect for an **${exp}** experience level because you don't need to timing-trade the market. Consistent, regular investments grow over time.

${profileContext}
${portfolioContext}

**Suggested Next Lesson:**
- Read **Investing 101** to learn about common building blocks.

${disclaimer}`;
  }

  if (
    query.includes("budget") ||
    query.includes("saving") ||
    query.includes("expense") ||
    query.includes("emergency") ||
    query.includes("money")
  ) {
    return `### 💵 Smart Budgeting & Emergency Savings

A budget is a plan that helps you connect your money to your priorities. It's not about restriction—it's about giving every dollar a job.

**A Simple Guideline for Students:**
1. **The 50/30/20 Rule:**
   - **50% Needs:** Rent, groceries, utility bills, and loan minimums.
   - **30% Wants:** Dining out, entertainment, and hobbies.
   - **20% Savings:** Emergency savings, debt paydown, or future investments.
2. **Emergency Savings Buffer:**
   - Before taking investment risk in the market, build a starter buffer of **$500 to $1,000**, or eventually **3–6 months of expenses**. Keep this cash in a liquid High-Yield Savings Account (HYSA).
3. **Automate It:**
   - Set up an automatic transfer to your savings on payday so you "pay yourself first."

${profileContext}

**Suggested Next Lesson:**
- Complete **Budgeting Without the Guilt** in the learning modules to test your skills!

${disclaimer}`;
  }

  if (
    query.includes("credit") ||
    query.includes("debt") ||
    query.includes("loan") ||
    query.includes("score") ||
    query.includes("apr")
  ) {
    return `### 💳 Understanding Credit, Debt & Interest

Your credit score is like a financial GPA. Lenders use it to determine if they can trust you to repay borrowed money.

**Core Principles of Credit:**
1. **Payment History (35% of score):** Always pay at least the minimum on time. Late payments harm your score significantly.
2. **Credit Utilization (30% of score):** Keep your revolving balances below 30% of your total credit limit. Paying in full monthly is ideal.
3. **Understanding APR (Annual Percentage Rate):** This represents the cost of borrowing. Credit card debt is high-APR debt (often 20%+), meaning interest compounds fast.
4. **Student Loans:** Compare federal loans (which have standard repayment options) with private loans. Focus on total repayment cost, not just the monthly payment.

${profileContext}

**Suggested Next Lesson:**
- Complete **Credit, Debt & Student Loans** in the curriculum to earn your credit badge.

${disclaimer}`;
  }

  if (
    query.includes("tax") ||
    query.includes("filing") ||
    query.includes("refund") ||
    query.includes("w-2") ||
    query.includes("w-4") ||
    query.includes("withholding")
  ) {
    return `### 📝 Tax Basics for Students

Filing taxes is the process of reconciling what you already paid in taxes throughout the year (withheld from your paycheck) with what you actually owe based on your income.

**What you need to know:**
1. **W-4 Form:** Completed when you start a job. It tells your employer how much federal tax to withhold from your pay.
2. **W-2 Form:** Sent by your employer in January. It details your earnings and taxes withheld. You use this to file your tax return.
3. **Filing a Return:** If you have income, you may be required to file. Even if you are not required, filing can help you retrieve a **tax refund** if too much was withheld.
4. **Tax Deductions & Credits:** Students may qualify for special education tax credits (like the American Opportunity Tax Credit). Keep records and receipts!

${profileContext}

**Suggested Next Lesson:**
- Complete **Tax Basics for Students** to master these terms.

${disclaimer}`;
  }

  if (
    query.includes("risk") ||
    query.includes("diversification") ||
    query.includes("volatile") ||
    query.includes("volatility") ||
    query.includes("diversify")
  ) {
    return `### ⚖️ Balancing Risk & Diversification

Risk and return go hand-in-hand. To achieve higher long-term gains, you must be willing to accept more short-term price fluctuations (volatility).

**Key Concepts:**
1. **Risk Tolerance vs. Risk Capacity:**
   - *Risk Tolerance* is how you feel about market drops (your psychological comfort).
   - *Risk Capacity* is your financial ability to withstand drops based on your timeline. For college students with decades ahead, capacity is generally high.
2. **The Power of Diversification:**
   - Don't put all your eggs in one basket. By holding multiple asset classes (stocks, bonds, real estate) and different industries, you protect yourself if one sector drops.
3. **Rebalancing:**
   - Over time, some investments grow faster than others. Rebalancing means periodically buying or selling assets to restore your target allocation.

${profileContext}
${portfolioContext}

**Suggested Next Lesson:**
- Complete **Risk & Diversification** in the curriculum.

${disclaimer}`;
  }

  return `### 👋 Welcome to FinSight AI Financial Education!

I'm here to help you learn about budgeting, credit, student taxes, and investing.

Here is a beginner-friendly framework for your financial journey:
1. **Build a budget:** Understand where your money goes using the 50/30/20 guidelines.
2. **Establish a buffer:** Save a small emergency fund before taking on investment risk.
3. **Understand credit:** Pay bills on time to build a strong financial reputation.
4. **Invest early:** Utilize passive index funds or ETFs to grow your money over the long term.

${profileContext}
${portfolioContext}

**What would you like to explore next?**
- Try asking: *"What is an index fund?"*, *"Help me make a budget"*, or *"What is credit score?"*.

${disclaimer}`;
}

export async function askAdvisor({ message, history, user, portfolios }) {
  // 1. Try Groq API if key is present
  if (env.groqApiKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.groqModel,
          temperature: 0.45,
          max_tokens: 700,
          messages: [
            { role: "system", content: systemPrompt(user, portfolios) },
            ...history.slice(-10).map(({ role, content }) => ({ role, content })),
            { role: "user", content: message }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          content: data.choices?.[0]?.message?.content || localFallbackResponder({ message, user, portfolios }),
          provider: "groq"
        };
      }
      console.warn(`Groq API returned status ${response.status}. Falling back.`);
    } catch (error) {
      console.error("Failed to query Groq API, falling back:", error);
    }
  }

  // 2. Try Gemini API if key is present
  if (env.geminiApiKey) {
    try {
      const contents = [];
      for (const turn of history.slice(-10)) {
        const role = turn.role === "assistant" ? "model" : "user";
        contents.push({
          role,
          parts: [{ text: turn.content }]
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent?key=${env.geminiApiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemPrompt(user, portfolios) }]
          },
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: 700
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          return { content, provider: "gemini" };
        }
      }
      console.warn(`Gemini API returned status ${response.status}. Falling back.`);
    } catch (error) {
      console.error("Failed to query Gemini API, falling back:", error);
    }
  }

  // 3. Fallback to smart local responder
  return { content: localFallbackResponder({ message, user, portfolios }), provider: "demo" };
}

