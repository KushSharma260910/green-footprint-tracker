import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { Navigation } from '@/components/layout/Navigation';
import { EcoStatusCard } from '@/components/dashboard/EcoStatusCard';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { SuggestionsCard } from '@/components/dashboard/SuggestionsCard';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    activities, 
    todayActivities, 
    dailyTotal, 
    monthlyTotal, 
    categoryBreakdown,
    loading: activitiesLoading,
    deleteActivity,
  } = useActivities();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || activitiesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Track and reduce your carbon footprint</p>
          </div>
          <Link to="/add-activity">
            <Button variant="eco" size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Log Activity
            </Button>
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Eco Status */}
          <div className="animate-fade-in">
            <EcoStatusCard dailyTotal={dailyTotal} monthlyTotal={monthlyTotal} />
          </div>

          {/* Category Breakdown */}
          <div className="animate-fade-in-delay-1">
            <CategoryBreakdown breakdown={categoryBreakdown} dailyTotal={dailyTotal} />
          </div>

          {/* Suggestions */}
          <div className="animate-fade-in-delay-2">
            <SuggestionsCard activities={todayActivities} />
          </div>

          {/* Recent Activities - Full Width */}
          <div className="animate-fade-in-delay-3 md:col-span-2 lg:col-span-3">
            <RecentActivities activities={activities} onDelete={deleteActivity} />
          </div>
        </div>
      </main>
    </div>
  );
}
