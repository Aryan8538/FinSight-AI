import { Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ ...user.profile, goals: user.profile?.goals?.join(", ") || "" });
  const [saved, setSaved] = useState(false);
  async function submit(event) {
    event.preventDefault();
    await updateProfile({ ...form, goals: form.goals.split(",").map((item) => item.trim()).filter(Boolean) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <div className="page narrow-page">
      <div className="page-heading"><div><span className="eyebrow">Personalization</span><h1>Your money context.</h1><p>This helps the AI explain ideas at the right level. You can change it anytime.</p></div></div>
      <form className="panel profile-form" onSubmit={submit}>
        <div className="profile-identity"><span className="avatar large">{user.name.slice(0, 1).toUpperCase()}</span><div><h2>{user.name}</h2><p>{user.email}</p></div></div>
        <label>School or university<input value={form.school || ""} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="University name (optional)" /></label>
        <div className="form-grid">
          <label>Experience level<select value={form.experience || "beginner"} onChange={(e) => setForm({ ...form, experience: e.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>
          <label>Risk comfort<select value={form.riskTolerance || "balanced"} onChange={(e) => setForm({ ...form, riskTolerance: e.target.value })}><option value="conservative">Conservative</option><option value="balanced">Balanced</option><option value="growth">Growth-oriented</option></select></label>
        </div>
        <label>Financial goals<input value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} placeholder="Emergency fund, learn investing, pay student loans" /><small>Separate multiple goals with commas.</small></label>
        <div className="privacy-note"><ShieldCheck size={19} /><span>This profile is used only to personalize your FinSight experience.</span></div>
        <button className="button primary"><Save size={17} /> {saved ? "Saved!" : "Save profile"}</button>
      </form>
    </div>
  );
}

