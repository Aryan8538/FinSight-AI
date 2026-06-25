import { Download, Plus, Trash2, WalletCards, X } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import { api, money, percent } from "../lib/api.js";

const emptyHolding = { symbol: "", companyName: "", quantity: 1, purchasePrice: "", purchaseDate: new Date().toISOString().slice(0, 10) };

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [newName, setNewName] = useState("");
  const [holding, setHolding] = useState(emptyHolding);
  const [showHolding, setShowHolding] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);

  async function fetchCurrentPrice() {
    const symbol = holding.symbol.trim().toUpperCase();
    if (!symbol) return;
    setFetchingPrice(true);
    try {
      const data = await api(`/market/quote/${symbol}`);
      if (data && data.quote) {
        setHolding((current) => ({
          ...current,
          companyName: data.quote.companyName || current.companyName,
          purchasePrice: data.quote.price !== null ? data.quote.price : current.purchasePrice
        }));
      }
    } catch (err) {
      console.warn("Failed to auto-fetch quote", err);
    } finally {
      setFetchingPrice(false);
    }
  }

  async function load() {
    const data = await api("/portfolios");
    setPortfolios(data.portfolios);
    setActiveId((current) => current || data.portfolios[0]?._id || "");
  }
  useEffect(() => { load().catch(() => {}); }, []);
  const active = portfolios.find((item) => item._id === activeId);

  async function createPortfolio(event) {
    event.preventDefault();
    if (!newName.trim()) return;
    const data = await api("/portfolios", { method: "POST", body: JSON.stringify({ name: newName }) });
    setNewName("");
    await load();
    setActiveId(data.portfolio._id);
  }
  async function addHolding(event) {
    event.preventDefault();
    await api(`/portfolios/${activeId}/holdings`, { method: "POST", body: JSON.stringify(holding) });
    setHolding(emptyHolding);
    setShowHolding(false);
    await load();
  }
  async function removeHolding(id) {
    await api(`/portfolios/${activeId}/holdings/${id}`, { method: "DELETE" });
    await load();
  }
  async function downloadCsv() {
    const blob = await api(`/portfolios/${activeId}/export`);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${active.name}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div><span className="eyebrow">Paper investing</span><h1>Practice a strategy before risking a dollar.</h1><p>Create portfolios, add hypothetical purchases, and watch the math unfold.</p></div>
        {active && <button className="button primary" onClick={() => setShowHolding(true)}><Plus size={17} /> Add holding</button>}
      </div>
      <div className="portfolio-tabs">
        {portfolios.map((portfolio) => <button key={portfolio._id} className={activeId === portfolio._id ? "active" : ""} onClick={() => setActiveId(portfolio._id)}>{portfolio.name}</button>)}
        <form onSubmit={createPortfolio}><input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New portfolio" /><button aria-label="Create portfolio"><Plus size={16} /></button></form>
      </div>
      {!active ? <div className="panel"><EmptyState icon={WalletCards} title="Create your first paper portfolio" text="Try a long-term growth, emergency fund, or learning experiment portfolio." /></div> : (
        <>
          <section className="portfolio-summary">
            <div><span>Current value</span><strong>{money(active.metrics.totalValue)}</strong></div>
            <div><span>Total invested</span><strong>{money(active.metrics.totalCost)}</strong></div>
            <div><span>Total return</span><strong className={active.metrics.gainLoss >= 0 ? "positive" : "negative"}>{money(active.metrics.gainLoss)} <small>{percent(active.metrics.gainLossPercent)}</small></strong></div>
            <button className="button secondary" onClick={downloadCsv}><Download size={16} /> Export CSV</button>
          </section>
          <section className="panel holdings-panel">
            <div className="panel-heading"><div><span className="eyebrow">Holdings</span><h2>{active.name}</h2></div><span className="paper-badge">Paper portfolio</span></div>
            {active.holdings.length ? (
              <div className="table-wrap"><table>
                <thead><tr><th>Asset</th><th>Quantity</th><th>Avg. price</th><th>Current</th><th>Market value</th><th>Return</th><th /></tr></thead>
                <tbody>{active.holdings.map((item) => <tr key={item._id}>
                  <td><strong>{item.symbol}</strong><small>{item.companyName || "Listed asset"}</small></td>
                  <td>{item.quantity}</td><td>{money(item.purchasePrice)}</td><td>{money(item.currentPrice)}</td><td>{money(item.marketValue)}</td>
                  <td className={item.gainLoss >= 0 ? "positive" : "negative"}><strong>{money(item.gainLoss)}</strong><small>{percent(item.gainLossPercent)}</small></td>
                  <td><button className="icon-button subtle" onClick={() => removeHolding(item._id)}><Trash2 size={16} /></button></td>
                </tr>)}</tbody>
              </table></div>
            ) : <EmptyState icon={WalletCards} title="This portfolio is ready" text="Add a hypothetical purchase to start tracking performance." action={<button className="button primary" onClick={() => setShowHolding(true)}><Plus size={16} /> Add first holding</button>} />}
          </section>
        </>
      )}
      {showHolding && <div className="modal-backdrop"><form className="modal" onSubmit={addHolding}>
        <div className="modal-heading"><div><span className="eyebrow">Paper transaction</span><h2>Add a holding</h2></div><button type="button" className="icon-button" onClick={() => setShowHolding(false)}><X size={20} /></button></div>
        <div className="form-grid">
          <label>
            Ticker
            <input required value={holding.symbol} onChange={(e) => setHolding({ ...holding, symbol: e.target.value.toUpperCase() })} onBlur={fetchCurrentPrice} placeholder="AAPL" />
            {fetchingPrice && <span className="ticker-fetch-loader"><span className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} /> Fetching price...</span>}
          </label>
          <label>Company name<input value={holding.companyName} onChange={(e) => setHolding({ ...holding, companyName: e.target.value })} placeholder="Apple Inc." /></label>
          <label>Quantity<input required type="number" min="0.0001" step="any" value={holding.quantity} onChange={(e) => setHolding({ ...holding, quantity: e.target.value })} /></label>
          <label>Purchase price<input required type="number" min="0" step="any" value={holding.purchasePrice} onChange={(e) => setHolding({ ...holding, purchasePrice: e.target.value })} placeholder="180.00" /></label>
          <label>Purchase date<input required type="date" value={holding.purchaseDate} onChange={(e) => setHolding({ ...holding, purchaseDate: e.target.value })} /></label>
        </div>
        <p className="data-note">This is a simulation. No real order will be placed.</p>
        <button className="button primary full">Add to portfolio</button>
      </form></div>}
    </div>
  );
}

