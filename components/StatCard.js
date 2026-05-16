'use client';
import { kindIconFor } from '../utils/helpers';

export default function StatCard({ label, value, note = '', kind = 'info' }) {
  return (
    <div className={`stat-card kind-${kind}`}>
      <span className="stat-icon">{kindIconFor(kind)}</span>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}
