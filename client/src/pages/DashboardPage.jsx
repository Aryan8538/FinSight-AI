import { ArrowRight, BookOpen, Bot, BriefcaseBusiness, Sparkles, TrendingUp, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MarketChart from "../components/MarketChart.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api, money, percent } from "../lib/api.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState({ portfolios: [], modules: [], quotes: [] });
  const [chart, setChart] = useState([]);

  useEffect(() => {
    Promise.all([
      api("/portfolios"),
      api("/learning"),
      api("/market/watchlist"),
      api("/market/history/SPY?range=1M")
    ]).then(([portfolios, learning, market, history]) => {
      setData({ portfolios: portfolios.portfolios, modules: learning.modules, quotes: market.quotes });
      setChart(history.points);
    }).catch(() => {});
  }, []);

  const totals = data.portfolios.reduce((result, portfolio) => ({
    value: result.value + portfolio.metrics.totalValue,
    cost: result.cost + portfolio.metrics.totalCost
  }), { value: 0, cost: 0 });
  const completed = data.modules.filter((item) => item.progress?.completed).length;
  const gainPercent = totals.cost ? ((totals.value - totals.cost) / totals.cost) * 100 : 0;

  return (
    <div className="page">
      <div className="page-heading dashboard-heading">
        <div>
          <span className="eyebrow">Friday, your money check-in</span>
          <h1>Good to see you, {user?.name?.split(" ")[0]}.</h1>
          <p>Small steps compound. Here’s where your financial practice stands.</p>
        </div>
        <Link className="button primary" to="/advisor"><Sparkles size={17} /> Ask FinSight AI</Link>
      </div>

      <section className="stat-grid">
        <article className="stat-card hero-stat">
          <div className="stat-top"><span className="stat-icon"><WalletCards size={19} /></span><span>Paper portfolio</span></div>
          <strong>{money(totals.value)}</strong>
          <small className={gainPercent >= 0 ? "positive" : "negative"}>{percent(gainPercent)} all time</small>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon mint"><TrendingUp size={19} /></span><span>Watchlist</span></div>
          <strong>{data.quotes.length}</strong><small>companies you follow</small>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon amber"><BookOpen size={19} /></span><span>Learning</span></div>
          <strong>{completed}/{data.modules.length || 5}</strong><small>lessons completed</small>
        </article>
        <article className="stat-card">
          <div className="stat-top"><span className="stat-icon lavender"><BriefcaseBusiness size={19} /></span><span>Portfolios</span></div>
          <strong>{data.portfolios.length}</strong><small>practice strategies</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel market-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">Market pulse</span><h2>S&P 500 practice benchmark</h2></div>
            <Link to="/market">Explore market <ArrowRight size={16} /></Link>
          </div>
          <MarketChart data={chart} height={290} />
        </article>
        <article className="panel advisor-card">
          <div className="advisor-orb"><Bot size={28} /></div>
          <span className="eyebrow light">Your AI money mentor</span>
          <h2>There are no silly money questions.</h2>
          <p>Ask for a plain-English explanation tailored to your goals and experience.</p>
          <div className="prompt-list">
            <Link to="/advisor?prompt=How should I start investing with $50?">“How should I start with $50?”</Link>
            <Link to="/advisor?prompt=Explain ETFs like I am new to investing">“Explain ETFs simply.”</Link>
          </div>
          <Link className="button light full" to="/advisor">Start a conversation <ArrowRight size={17} /></Link>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div><span className="eyebrow">Keep learning</span><h2>Build a skill in under 10 minutes</h2></div>
          <Link to="/learn">View all lessons <ArrowRight size={16} /></Link>
        </div>
        <div className="lesson-row">
          {data.modules.slice(0, 3).map((module, index) => (
            <Link to={`/learn/${module.slug}`} className="lesson-mini" key={module._id}>
              <span className={`lesson-number n${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
              <span><small>{module.category} · {module.readMinutes} min</small><strong>{module.title}</strong></span>
              <ArrowRight size={17} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

