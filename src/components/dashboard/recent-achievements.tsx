import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap, Code } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'zap' | 'code';
  iconColor: string;
  bgColor: string;
}

interface RecentAchievementsProps {
  achievements?: Achievement[];
}

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'React Master',
    description: 'Completed 10 React courses',
    icon: 'trophy',
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    id: '2',
    title: 'Week Warrior',
    description: '7-day learning streak',
    icon: 'zap',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    id: '3',
    title: 'Code Reviewer',
    description: 'Helped 5 peers',
    icon: 'code',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100'
  }
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'trophy':
      return Trophy;
    case 'zap':
      return Zap;
    case 'code':
      return Code;
    default:
      return Trophy;
  }
};

export function RecentAchievements({ achievements = defaultAchievements }: RecentAchievementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.map((achievement) => {
          const IconComponent = getIcon(achievement.icon);
          
          return (
            <div key={achievement.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${achievement.bgColor} rounded-full flex items-center justify-center`}>
                <IconComponent className={`w-4 h-4 ${achievement.iconColor}`} />
              </div>
              <div>
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}