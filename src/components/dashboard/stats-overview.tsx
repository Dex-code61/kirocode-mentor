import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Zap, Trophy, Clock } from "lucide-react";

interface Stat {
  icon: 'book' | 'zap' | 'trophy' | 'clock';
  label: string;
  value: number | string;
}

interface StatsOverviewProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { icon: 'book', label: 'Courses Completed', value: 12 },
  { icon: 'zap', label: 'Streak Days', value: 7 },
  { icon: 'trophy', label: 'Achievements', value: 23 },
  { icon: 'clock', label: 'Hours Learned', value: 156 }
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'book':
      return BookOpen;
    case 'zap':
      return Zap;
    case 'trophy':
      return Trophy;
    case 'clock':
      return Clock;
    default:
      return BookOpen;
  }
};

export function StatsOverview({ stats = defaultStats }: StatsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const IconComponent = getIcon(stat.icon);
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4 text-primary" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <span className="font-bold">{stat.value}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}