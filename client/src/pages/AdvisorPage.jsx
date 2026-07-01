import { Bot, Plus, Send, Sparkles, Trash2, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api.js";

const starters = ["How do index funds work?", "Help me build a student budget", "What should I know about credit scores?", "How much emergency savings do I need?"];

export default function AdvisorPage() {
  const [params] = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState(params.get("prompt") || "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  async function loadSessions() {
    const data = await api("/chat/sessions");
    setSessions(data.sessions);
  }
  useEffect(() => { loadSessions(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [session?.messages, sending]);
  async function openSession(id) {
    setError("");
    const data = await api(`/chat/sessions/${id}`);
    setSession(data.session);
  }
  async function send(event) {
    event?.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    setMessage("");
    setSending(true);
    setError("");
    setSession((current) => ({ ...(current || { messages: [] }), messages: [...(current?.messages || []), { role: "user", content: text }] }));
    try {
      const data = await api("/chat/messages", { method: "POST", body: JSON.stringify({ message: text, sessionId: session?._id }) });
      setSession(data.session);
      await loadSessions();
    } catch (err) {
      setError(err.message || "Failed to send message. Please check your connection.");
    } finally {
      setSending(false);
    }
  }
  async function remove(id) {
    await api(`/chat/sessions/${id}`, { method: "DELETE" });
    if (session?._id === id) setSession(null);
    await loadSessions();
  }

  return (
    <div className="advisor-page">
      <aside className="chat-history">
        <button className="button primary full" onClick={() => { setSession(null); setError(""); }}><Plus size={17} /> New conversation</button>
        <span className="eyebrow">Recent chats</span>
        <div>
          {sessions.map((item) => (
            <div
              className={`chat-session-item ${session?._id === item._id ? "active" : ""}`}
              key={item._id}
              onClick={() => openSession(item._id)}
            >
              <span className="chat-session-title">{item.title}</span>
              <button
                className="delete-chat-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  remove(item._id);
                }}
                title="Delete conversation"
                aria-label="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </aside>
      <section className="chat-main">
        <header className="chat-header"><div className="advisor-avatar"><Sparkles size={20} /></div><div><strong>FinSight AI Advisor</strong><span><i /> Ready to help · Educational guidance</span></div></header>
        <div className="messages">
          {!session?.messages?.length ? <div className="chat-welcome"><span className="big-advisor-orb"><Bot size={35} /></span><span className="eyebrow">Your judgment-free money space</span><h1>What’s on your mind?</h1><p>Ask a question and I’ll explain it in plain language, using your goals and paper portfolio for context.</p><div className="starter-grid">{starters.map((starter) => <button key={starter} onClick={() => setMessage(starter)}>{starter}</button>)}</div></div> : session.messages.map((item, index) => <div className={`message ${item.role}`} key={`${index}-${item.createdAt || ""}`}><span className="message-avatar">{item.role === "assistant" ? <Bot size={17} /> : <UserRound size={17} />}</span><div>{item.content.split("\n").map((line, i) => <p key={i}>{line || <br />}</p>)}</div></div>)}
          {sending && <div className="message assistant"><span className="message-avatar"><Bot size={17} /></span><div className="typing"><i /><i /><i /></div></div>}
          <div ref={bottomRef} />
        </div>
        <form className="chat-composer" onSubmit={send}>
          {error && <div className="chat-error">{error}</div>}
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask about budgeting, investing, credit, your paper portfolio…" rows={1} />
          <button disabled={!message.trim() || sending} aria-label="Send message"><Send size={19} /></button>
          <small>FinSight can make mistakes. Use answers for education, not as financial advice.</small>
        </form>
      </section>
    </div>
  );
}

