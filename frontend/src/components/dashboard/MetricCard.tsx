/**
 * Tarjeta de métrica individual
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div
      className={`rounded-lg border-2 p-6 ${colorClasses[color]} transition-all hover:shadow-lg`}
    >
      <h3 className="text-sm font-medium opacity-75 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold">{value}</p>
        {trend && trendValue && (
          <span
            className={`text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {trendIcons[trend]} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm opacity-75 mt-2">{subtitle}</p>}
    </div>
  );
}
