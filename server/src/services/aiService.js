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

function fallbackAnswer(message) {
  return `Here is a beginner-friendly way to think about "${message}":

1. Start with your goal and time horizon.
2. Keep an emergency buffer before taking investment risk.
3. Prefer diversification over relying on one company or trend.
4. Compare fees, risk, and liquidity before deciding.

A useful next lesson is **Risk & Diversification**. ${disclaimer}`;
}

export async function askAdvisor({ message, history, user, portfolios }) {
  if (!env.groqApiKey) return { content: fallbackAnswer(message), provider: "demo" };

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

  if (!response.ok) throw new Error(`Groq API returned ${response.status}`);
  const data = await response.json();
  return { content: data.choices?.[0]?.message?.content || fallbackAnswer(message), provider: "groq" };
}

