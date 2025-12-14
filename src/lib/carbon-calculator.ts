// Carbon emission factors in kg CO₂
export const EMISSION_FACTORS = {
  car: 0.21, // kg CO₂ per km
  bike: 0.05, // kg CO₂ per km
  public_transport: 0.089, // kg CO₂ per km (average bus/train)
  electricity: 0.82, // kg CO₂ per kWh
  vegetarian_meal: 1.5, // kg CO₂ per meal
  non_vegetarian_meal: 3.3, // kg CO₂ per meal
} as const;

export type ActivityType = keyof typeof EMISSION_FACTORS;

export function calculateCarbon(type: ActivityType, value: number): number {
  return Number((EMISSION_FACTORS[type] * value).toFixed(4));
}

export function getEcoStatus(dailyTotal: number): {
  status: 'low' | 'medium' | 'high';
  label: string;
  message: string;
  color: string;
} {
  if (dailyTotal < 5) {
    return {
      status: 'low',
      label: 'Low Footprint',
      message: 'Great job! Keep up the sustainable lifestyle.',
      color: 'eco-low',
    };
  } else if (dailyTotal <= 15) {
    return {
      status: 'medium',
      label: 'Medium Footprint',
      message: 'Room for improvement. Try switching to public transport or bike.',
      color: 'eco-medium',
    };
  } else {
    return {
      status: 'high',
      label: 'High Footprint',
      message: 'Consider reducing car usage and choosing vegetarian meals.',
      color: 'eco-high',
    };
  }
}

export function getSuggestions(activities: { activity_type: ActivityType; carbon_kg: number }[]): string[] {
  const suggestions: string[] = [];
  
  const carUsage = activities
    .filter(a => a.activity_type === 'car')
    .reduce((sum, a) => sum + a.carbon_kg, 0);
  
  const meatMeals = activities
    .filter(a => a.activity_type === 'non_vegetarian_meal')
    .length;
  
  const electricity = activities
    .filter(a => a.activity_type === 'electricity')
    .reduce((sum, a) => sum + a.carbon_kg, 0);

  if (carUsage > 3) {
    suggestions.push('🚌 Consider using public transport or carpooling to reduce transport emissions');
  }
  
  if (meatMeals >= 2) {
    suggestions.push('🥗 Try adding more vegetarian meals to your diet - each switch saves ~1.8 kg CO₂');
  }
  
  if (electricity > 2) {
    suggestions.push('💡 Switch off unused appliances and consider energy-efficient alternatives');
  }

  if (activities.some(a => a.activity_type === 'bike')) {
    suggestions.push('🚴 Great choice using a bike! Keep it up for a healthier you and planet');
  }

  if (suggestions.length === 0) {
    suggestions.push('🌱 You\'re doing great! Keep making sustainable choices every day');
  }

  return suggestions.slice(0, 3);
}

export const ACTIVITY_LABELS: Record<ActivityType, { label: string; unit: string; icon: string }> = {
  car: { label: 'Car Travel', unit: 'km', icon: '🚗' },
  bike: { label: 'Bike/Walk', unit: 'km', icon: '🚴' },
  public_transport: { label: 'Public Transport', unit: 'km', icon: '🚌' },
  electricity: { label: 'Electricity', unit: 'kWh', icon: '⚡' },
  vegetarian_meal: { label: 'Vegetarian Meal', unit: 'meals', icon: '🥗' },
  non_vegetarian_meal: { label: 'Non-Veg Meal', unit: 'meals', icon: '🍖' },
};
