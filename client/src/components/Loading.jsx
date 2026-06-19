export default function Loading({ label = "Loading your dashboard…" }) {
  return (
    <div className="loading-state">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}

