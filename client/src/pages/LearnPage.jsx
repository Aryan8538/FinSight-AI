import { ArrowRight, Award, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function LearnPage() {
  const [modules, setModules] = useState([]);
  useEffect(() => { api("/learning").then((data) => setModules(data.modules)); }, []);
  const completed = modules.filter((module) => module.progress?.completed).length;
  const progress = modules.length ? Math.round((completed / modules.length) * 100) : 0;
  return (
    <div className="page">
      <div className="page-heading">
        <div><span className="eyebrow">FinSight Academy</span><h1>Money lessons made for real student life.</h1><p>Clear, useful, and short enough to finish between classes.</p></div>
      </div>
      <section className="learning-progress panel">
        <div className="progress-icon"><Award size={25} /></div>
        <div><span className="eyebrow">Your progress</span><h2>{completed} lessons complete</h2><p>Every finished quiz adds a badge to your profile.</p></div>
        <div className="progress-meter"><div><span style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
      </section>
      <section className="lesson-grid">
        {modules.map((module, index) => (
          <Link className="lesson-card" to={`/learn/${module.slug}`} key={module._id}>
            <div className={`lesson-art art-${(index % 5) + 1}`}><BookOpen size={28} /><span>{module.category}</span>{module.progress?.completed && <CheckCircle2 className="completed-check" size={23} />}</div>
            <div className="lesson-content"><div className="lesson-meta"><span><Clock size={14} /> {module.readMinutes} min</span><span>{module.level}</span></div><h2>{module.title}</h2><p>{module.summary}</p><span className="lesson-link">{module.progress?.completed ? "Review lesson" : "Start learning"} <ArrowRight size={16} /></span></div>
          </Link>
        ))}
      </section>
    </div>
  );
}

