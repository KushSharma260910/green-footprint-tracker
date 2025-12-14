import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACTIVITY_LABELS, ActivityType } from '@/lib/carbon-calculator';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  activity_type: ActivityType;
  value: number;
  carbon_kg: number;
  activity_date: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  onDelete: (id: string) => void;
}

export function RecentActivities({ activities, onDelete }: RecentActivitiesProps) {
  const recentActivities = activities.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No activities logged yet</p>
            <p className="text-sm">Start by adding your first activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const config = ACTIVITY_LABELS[activity.activity_type];
              return (
                <div
                  key={activity.id}
                  className="animate-fade-in flex items-center justify-between rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.value} {config.unit} • {format(new Date(activity.activity_date), 'MMM d')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      {Number(activity.carbon_kg).toFixed(2)} kg
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
