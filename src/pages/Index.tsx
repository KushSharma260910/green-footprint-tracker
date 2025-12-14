import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight, TrendingDown, BarChart3, Lightbulb } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="mb-8 inline-block animate-float">
            <div className="eco-gradient rounded-3xl p-6 shadow-glow">
              <Leaf className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Track Your
            <span className="eco-gradient-text"> Carbon Footprint</span>
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Make sustainable choices every day. Log your activities, understand your impact, 
            and get personalized tips to reduce your carbon emissions.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button variant="eco" size="lg" className="gap-2 text-lg">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="animate-fade-in rounded-2xl border border-border/50 bg-card p-6 text-center shadow-eco">
            <div className="eco-gradient mx-auto mb-4 inline-flex rounded-xl p-3">
              <TrendingDown className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Track Daily</h3>
            <p className="text-sm text-muted-foreground">
              Log transport, electricity, and food choices to see your daily carbon impact
            </p>
          </div>

          <div className="animate-fade-in-delay-1 rounded-2xl border border-border/50 bg-card p-6 text-center shadow-eco">
            <div className="eco-gradient mx-auto mb-4 inline-flex rounded-xl p-3">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Visual Insights</h3>
            <p className="text-sm text-muted-foreground">
              See breakdowns by category and track your progress over time
            </p>
          </div>

          <div className="animate-fade-in-delay-2 rounded-2xl border border-border/50 bg-card p-6 text-center shadow-eco">
            <div className="eco-gradient mx-auto mb-4 inline-flex rounded-xl p-3">
              <Lightbulb className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Smart Tips</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized sustainability suggestions based on your habits
            </p>
          </div>
        </div>

        {/* Emission Factors Info */}
        <div className="mt-24 mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold">How We Calculate</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: '🚗', label: 'Car', value: '0.21 kg CO₂/km' },
              { icon: '🚴', label: 'Bike', value: '0.05 kg CO₂/km' },
              { icon: '🚌', label: 'Public Transport', value: '0.089 kg CO₂/km' },
              { icon: '⚡', label: 'Electricity', value: '0.82 kg CO₂/kWh' },
              { icon: '🥗', label: 'Vegetarian Meal', value: '1.5 kg CO₂' },
              { icon: '🍖', label: 'Non-Veg Meal', value: '3.3 kg CO₂' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
