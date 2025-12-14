import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ACTIVITY_LABELS, ActivityType, EMISSION_FACTORS } from '@/lib/carbon-calculator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityFormProps {
  onSubmit: (type: ActivityType, value: number, date: Date) => Promise<{ error: Error | null }>;
}

export function ActivityForm({ onSubmit }: ActivityFormProps) {
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [value, setValue] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !value) return;

    setLoading(true);
    const result = await onSubmit(selectedType, parseFloat(value), date);
    setLoading(false);

    if (!result.error) {
      setSelectedType(null);
      setValue('');
      setDate(new Date());
    }
  };

  const selectedConfig = selectedType ? ACTIVITY_LABELS[selectedType] : null;
  const previewCarbon = selectedType && value 
    ? (parseFloat(value) * EMISSION_FACTORS[selectedType]).toFixed(2) 
    : '0.00';

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Log Activity</CardTitle>
        <CardDescription>Track your daily activities to monitor your carbon footprint</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div className="space-y-3">
            <Label>Activity Type</Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(Object.entries(ACTIVITY_LABELS) as [ActivityType, typeof ACTIVITY_LABELS[ActivityType]][]).map(
                ([type, config]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 hover:scale-[1.02]',
                      selectedType === type
                        ? 'border-primary bg-primary/10 shadow-eco'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <span className="text-3xl">{config.icon}</span>
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {EMISSION_FACTORS[type]} kg/{config.unit}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Value Input */}
          {selectedType && (
            <div className="animate-fade-in space-y-3">
              <Label htmlFor="value">
                {selectedConfig?.label} ({selectedConfig?.unit})
              </Label>
              <Input
                id="value"
                type="number"
                step="0.1"
                min="0"
                placeholder={`Enter ${selectedConfig?.unit}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="text-lg"
                required
              />
            </div>
          )}

          {/* Date Selection */}
          {selectedType && (
            <div className="animate-fade-in-delay-1 space-y-3">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    disabled={(d) => d > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Preview */}
          {selectedType && value && (
            <div className="animate-fade-in-delay-2 rounded-xl bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">Estimated Carbon Emission</p>
              <p className="text-3xl font-bold eco-gradient-text">{previewCarbon} kg CO₂</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="eco"
            size="lg"
            className="w-full"
            disabled={!selectedType || !value || loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging...
              </>
            ) : (
              'Log Activity'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
