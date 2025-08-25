import { StatItem } from '../../types';

export function StatCard({ number, label }: StatItem) {
  return (
    <div className="stat-card">
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}