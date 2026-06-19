import { ArrowRight, BookOpen, Bot, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "register") await register(form);
      else await login({ email: form.email, password: form.password });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Logo />
        <div className="auth-copy">
          <span className="eyebrow light">Money confidence starts here</span>
          <h1>Learn money.<br />Practice investing.<br /><em>Ask anything.</em></h1>
          <p>A calm, student-friendly place to understand finance, track the market, and practice without risking real money.</p>
          <div className="feature-pills">
            <span><Bot size={17} /> Personal AI guidance</span>
            <span><ChartNoAxesCombined size={17} /> Paper portfolios</span>
            <span><BookOpen size={17} /> Bite-sized lessons</span>
          </div>
        </div>
        <div className="auth-note"><ShieldCheck size={18} /><span>Your data stays private. FinSight never executes trades.</span></div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">{mode === "register" ? "Create your free account" : "Welcome back"}</span>
          <h2>{mode === "register" ? "Build your money confidence." : "Continue your journey."}</h2>
          <p>{mode === "register" ? "No credit card. No confusing jargon. Just a smarter place to begin." : "Your portfolio and learning progress are waiting."}</p>
          {mode === "register" && (
            <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" /></label>
          )}
          <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@university.edu" /></label>
          <label>Password<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="button primary full" disabled={submitting}>{submitting ? "One moment…" : mode === "register" ? "Start learning" : "Sign in"} <ArrowRight size={18} /></button>
          <div className="auth-switch">
            {mode === "register" ? "Already have an account?" : "New to FinSight?"}
            <button type="button" onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}>
              {mode === "register" ? "Sign in" : "Create account"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

