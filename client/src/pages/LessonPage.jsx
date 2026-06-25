import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { api } from "../lib/api.js";

export default function LessonPage() {
  const { slug } = useParams();
  const [module, setModule] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  useEffect(() => { api(`/learning/${slug}`).then((data) => setModule(data.module)); }, [slug]);
  if (!module) return <Loading label="Opening your lesson…" />;

  async function submit(event) {
    event.preventDefault();
    setResult(await api(`/learning/${slug}/quiz`, { method: "POST", body: JSON.stringify({ answers }) }));
  }
  return (
    <div className="page lesson-page">
      <Link className="back-link" to="/learn"><ArrowLeft size={16} /> Back to all lessons</Link>
      <header className="lesson-header"><span className="eyebrow">{module.category} · {module.readMinutes} min</span><h1>{module.title}</h1><p>{module.summary}</p></header>
      <div className="lesson-layout">
        <article className="lesson-article panel">
          {module.content.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
          <div className="takeaway-box"><span className="eyebrow">Remember this</span><ul>{module.takeaways.map((item) => <li key={item}><CheckCircle2 size={17} /> {item}</li>)}</ul></div>
        </article>
        <form className="quiz-card panel" onSubmit={submit}>
          <span className="eyebrow">Quick knowledge check</span><h2>Test what stuck</h2>
          {module.quiz.map((question, qIndex) => <fieldset key={question._id}><legend>{qIndex + 1}. {question.question}</legend>{question.options.map((option, oIndex) => <label className="quiz-option" key={option}><input required type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === oIndex} onChange={() => setAnswers((current) => { const next = [...current]; next[qIndex] = oIndex; return next; })} /><span>{option}</span></label>)}</fieldset>)}
          {result && <div className={result.completed ? "quiz-result success" : "quiz-result"}><strong>{result.score}%</strong><span>{result.completed ? "Nice work — lesson complete!" : "Give it another try. Review the explanations below."}</span></div>}
          <button className="button primary full">Check my answers</button>
        </form>
      </div>
    </div>
  );
}

