import { ArrowRight, BookOpen, Bot, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import Logo from "../components/Logo.jsx";

export default function AuthPage() {
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
        <div className="auth-card">
          <span className="eyebrow">Demo mode enabled</span>
          <h2>No account required.</h2>
          <p>Authentication has been removed, so visitors can explore FinSight AI immediately using the shared demo workspace.</p>
          <a className="button primary full" href="/">Open FinSight AI <ArrowRight size={18} /></a>
        </div>
      </section>
    </div>
  );
}
