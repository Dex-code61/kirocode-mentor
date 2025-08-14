import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, Code, Users } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'completion' | 'start' | 'join';
  title: string;
  timeAgo: string;
  icon: 'trophy' | 'code' | 'users';
  iconColor: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'completion',
    title: 'Completed: JavaScript Async/Await',
    timeAgo: '2 hours ago',
    icon: 'trophy',
    iconColor: 'text-green-600'
  },
  {
    id: '2',
    type: 'start',
    title: 'Started: React Custom Hooks',
    timeAgo: 'Yesterday',
    icon: 'code',
    iconColor: 'text-blue-600'
  },
  {
    id: '3',
    type: 'join',
    title: 'Joined: Advanced React Study Group',
    timeAgo: '3 days ago',
    icon: 'users',
    iconColor: 'text-purple-600'
  }
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'trophy':
      return Trophy;
    case 'code':
      return Code;
    case 'users':
      return Users;
    default:
      return Code;
  }
};

const getIconBgColor = (iconType: string) => {
  switch (iconType) {
    case 'trophy':
      return 'bg-green-100';
    case 'code':
      return 'bg-blue-100';
    case 'users':
      return 'bg-purple-100';
    default:
      return 'bg-gray-100';
  }
};

export function RecentActivity({ activities = defaultActivities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getIcon(activity.icon);
            const bgColor = getIconBgColor(activity.icon);
            
            return (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
                  <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}