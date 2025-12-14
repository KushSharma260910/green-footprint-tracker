import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { calculateCarbon, ActivityType } from '@/lib/carbon-calculator';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  value: number;
  carbon_kg: number;
  activity_date: string;
  created_at: string;
}

export function useActivities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion since we know the structure matches
      setActivities((data || []) as unknown as Activity[]);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activities. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = async (type: ActivityType, value: number, date: Date) => {
    if (!user) return { error: new Error('Not authenticated') };

    const carbonKg = calculateCarbon(type, value);
    const activityDate = date.toISOString().split('T')[0];

    try {
      const { error } = await supabase.from('activities').insert({
        user_id: user.id,
        activity_type: type,
        value,
        carbon_kg: carbonKg,
        activity_date: activityDate,
      });

      if (error) throw error;

      await fetchActivities();
      
      toast({
        title: 'Activity logged',
        description: `Added ${value} ${type === 'electricity' ? 'kWh' : type.includes('meal') ? 'meal(s)' : 'km'} of ${type.replace('_', ' ')}`,
      });

      return { error: null };
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to add activity. Please try again.',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);

      if (error) throw error;

      await fetchActivities();
      
      toast({
        title: 'Activity deleted',
        description: 'The activity has been removed.',
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete activity. Please try again.',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  };

  // Calculate daily total for today
  const today = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter(a => a.activity_date === today);
  const dailyTotal = todayActivities.reduce((sum, a) => sum + Number(a.carbon_kg), 0);

  // Calculate monthly total
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthActivities = activities.filter(a => a.activity_date.startsWith(currentMonth));
  const monthlyTotal = monthActivities.reduce((sum, a) => sum + Number(a.carbon_kg), 0);

  // Category breakdown for today
  const categoryBreakdown = todayActivities.reduce((acc, activity) => {
    const category = activity.activity_type.includes('meal') 
      ? 'food' 
      : activity.activity_type === 'electricity' 
        ? 'electricity' 
        : 'transport';
    
    acc[category] = (acc[category] || 0) + Number(activity.carbon_kg);
    return acc;
  }, {} as Record<string, number>);

  return {
    activities,
    todayActivities,
    monthActivities,
    loading,
    addActivity,
    deleteActivity,
    dailyTotal,
    monthlyTotal,
    categoryBreakdown,
    refetch: fetchActivities,
  };
}
