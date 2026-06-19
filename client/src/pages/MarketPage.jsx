import { Plus, Search, Star, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import MarketChart from "../components/MarketChart.jsx";
import { api, money, percent } from "../lib/api.js";

export default function MarketPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState("1M");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function loadWatchlist() {
    const data = await api("/market/watchlist");
    setWatchlist(data.quotes);
    if (!selected && data.quotes[0]) setSelected(data.quotes[0]);
  }

  useEffect(() => { loadWatchlist().catch(() => {}); }, []);
  useEffect(() => {
    if (selected) api(`/market/history/${selected.symbol}?range=${range}`).then((data) => setHistory(data.points));
  }, [selected?.symbol, range]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) api(`/market/search?q=${encodeURIComponent(query)}`).then((data) => setResults(data.results));
      else setResults([]);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  async function add(symbol) {
    await api(`/market/watchlist/${symbol}`, { method: "POST" });
    setQuery("");
    setResults([]);
    await loadWatchlist();
  }
  async function remove(symbol) {
    await api(`/market/watchlist/${symbol}`, { method: "DELETE" });
    if (selected?.symbol === symbol) setSelected(null);
    await loadWatchlist();
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div><span className="eyebrow">Market lab</span><h1>Follow companies. Learn the patterns.</h1><p>Observe price movement without pressure to trade.</p></div>
      </div>
      <div className="market-layout">
        <aside className="panel watchlist-panel">
          <div className="panel-heading"><div><span className="eyebrow">Your list</span><h2>Watchlist</h2></div><Star size={18} /></div>
          <div className="search-box">
            <Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ticker or company" />
            {results.length > 0 && (
              <div className="search-results">
                {results.map((item) => <button key={item.symbol} onClick={() => add(item.symbol)}><span><strong>{item.symbol}</strong><small>{item.description}</small></span><Plus size={16} /></button>)}
              </div>
            )}
          </div>
          <div className="watchlist-items">
            {watchlist.length ? watchlist.map((quote) => (
              <button className={`watch-row ${selected?.symbol === quote.symbol ? "active" : ""}`} key={quote.symbol} onClick={() => setSelected(quote)}>
                <span className="ticker-mark">{quote.symbol.slice(0, 1)}</span>
                <span className="watch-name"><strong>{quote.symbol}</strong><small>{quote.companyName}</small></span>
                <span className="watch-price"><strong>{money(quote.price)}</strong><small className={quote.changePercent >= 0 ? "positive" : "negative"}>{percent(quote.changePercent)}</small></span>
                <span role="button" className="row-delete" onClick={(e) => { e.stopPropagation(); remove(quote.symbol); }}><Trash2 size={14} /></span>
              </button>
            )) : <EmptyState icon={Star} title="Start a watchlist" text="Search for AAPL, MSFT, NVDA, or another company." />}
          </div>
        </aside>
        <section className="panel stock-detail">
          {selected ? (
            <>
              <div className="stock-hero">
                <div><span className="eyebrow">{selected.companyName}</span><h2>{selected.symbol}</h2></div>
                <div className="stock-price"><strong>{money(selected.price)}</strong><span className={selected.changePercent >= 0 ? "positive badge-change" : "negative badge-change"}>{selected.changePercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}{percent(selected.changePercent)}</span></div>
              </div>
              <div className="range-tabs">{["1D", "1W", "1M", "3M", "1Y"].map((item) => <button className={range === item ? "active" : ""} onClick={() => setRange(item)} key={item}>{item}</button>)}</div>
              <MarketChart data={history} height={360} />
              <div className="quote-grid">
                <span><small>Open</small><strong>{money(selected.open)}</strong></span>
                <span><small>Day high</small><strong>{money(selected.high)}</strong></span>
                <span><small>Day low</small><strong>{money(selected.low)}</strong></span>
                <span><small>Previous close</small><strong>{money(selected.previousClose)}</strong></span>
              </div>
              {selected.source === "demo" && <p className="data-note">Demo market data is active. Add a Finnhub API key for live quotes.</p>}
            </>
          ) : <EmptyState icon={TrendingUp} title="Choose a company" text="Add a ticker to your watchlist, then select it to study its movement." />}
        </section>
      </div>
    </div>
  );
}

