import { Card, CardContent } from '@/components/ui/card';
import { getEcoStatus } from '@/lib/carbon-calculator';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EcoStatusCardProps {
  dailyTotal: number;
  monthlyTotal: number;
}

export function EcoStatusCard({ dailyTotal, monthlyTotal }: EcoStatusCardProps) {
  const status = getEcoStatus(dailyTotal);

  const StatusIcon = status.status === 'low' 
    ? TrendingDown 
    : status.status === 'high' 
      ? TrendingUp 
      : Minus;

  return (
    <Card className="overflow-hidden">
      <div className={cn(
        'p-1',
        status.status === 'low' && 'eco-status-low',
        status.status === 'medium' && 'eco-status-medium',
        status.status === 'high' && 'eco-status-high',
      )}>
        <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium">
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </div>
      </div>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Today's Footprint</p>
            <p className="text-4xl font-bold eco-gradient-text">
              {dailyTotal.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">kg CO₂</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="text-center">
              <p className="text-2xl font-semibold">{monthlyTotal.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">kg this month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{(monthlyTotal / 30).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">daily average</p>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <p className="text-sm text-muted-foreground">{status.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
