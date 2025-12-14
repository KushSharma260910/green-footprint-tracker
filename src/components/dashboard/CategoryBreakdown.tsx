import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Zap, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryBreakdownProps {
  breakdown: Record<string, number>;
  dailyTotal: number;
}

const CATEGORY_CONFIG = {
  transport: { icon: Car, label: 'Transport', color: 'bg-primary' },
  electricity: { icon: Zap, label: 'Electricity', color: 'bg-accent' },
  food: { icon: Utensils, label: 'Food', color: 'bg-eco-medium' },
};

export function CategoryBreakdown({ breakdown, dailyTotal }: CategoryBreakdownProps) {
  const categories = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
    key,
    ...config,
    value: breakdown[key] || 0,
    percentage: dailyTotal > 0 ? ((breakdown[key] || 0) / dailyTotal) * 100 : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('rounded-lg p-2', category.color)}>
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium">{category.label}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{category.value.toFixed(2)} kg</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({category.percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', category.color)}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}

        {dailyTotal === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <p>No activities logged today</p>
            <p className="text-sm">Start tracking to see your breakdown</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
