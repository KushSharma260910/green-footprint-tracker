import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSuggestions, ActivityType } from '@/lib/carbon-calculator';
import { Lightbulb } from 'lucide-react';

interface SuggestionsCardProps {
  activities: { activity_type: ActivityType; carbon_kg: number }[];
}

export function SuggestionsCard({ activities }: SuggestionsCardProps) {
  const suggestions = getSuggestions(activities);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-eco-medium" />
          Sustainability Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="animate-fade-in rounded-lg bg-secondary/50 p-3 text-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
