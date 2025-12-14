import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Mail, Calendar, Leaf, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { monthlyTotal, activities } = useActivities();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data as Profile | null);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const totalActivities = activities.length;
  const avgDaily = monthlyTotal > 0 ? (monthlyTotal / 30).toFixed(1) : '0';

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your impact</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
                <div className="eco-gradient flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {(profile?.full_name || user.email || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-semibold">{profile?.full_name || 'Anonymous User'}</p>
                  <p className="text-sm text-muted-foreground">Carbon Tracker</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Member since {format(new Date(profile?.created_at || user.created_at), 'MMMM yyyy')}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={signOut}>
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Impact Stats */}
          <Card className="animate-fade-in-delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold eco-gradient-text">{totalActivities}</p>
                  <p className="text-sm text-muted-foreground">Activities Logged</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold eco-gradient-text">{monthlyTotal.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">kg CO₂ This Month</p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  <p className="font-medium">Daily Average</p>
                </div>
                <p className="text-2xl font-bold">{avgDaily} kg CO₂</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {parseFloat(avgDaily) < 5 
                    ? 'Great! You\'re below the recommended daily limit.'
                    : 'Try to reduce your daily average below 5 kg CO₂.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
