import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { Navigation } from '@/components/layout/Navigation';
import { ActivityForm } from '@/components/activities/ActivityForm';
import { Loader2 } from 'lucide-react';

export default function AddActivity() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addActivity } = useActivities();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Log Activity</h1>
          <p className="text-muted-foreground">Record your daily activities to track your carbon footprint</p>
        </div>

        <ActivityForm onSubmit={addActivity} />
      </main>
    </div>
  );
}
