import { useLanguage } from '../../context/LanguageContext';
import { StatCard } from './StatCard';
import { StatItem } from '../../types';

export function StatsGrid() {
  const { t } = useLanguage();

  const stats: StatItem[] = [
    { number: '95%', label: t.efficiency },
    { number: '99.9%', label: t.accuracy },
    { number: '10x', label: t.speed },
    { number: '40%', label: t.savings }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}