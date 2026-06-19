import { Sparkles } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <div className="logo">
      <span className="logo-mark"><Sparkles size={18} /></span>
      {!compact && <span>FinSight <b>AI</b></span>}
    </div>
  );
}

