import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Users, Brain, Target } from "lucide-react";

interface QuickAction {
  icon: 'code' | 'users' | 'brain' | 'target';
  label: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  { icon: 'code', label: 'Start Coding Challenge' },
  { icon: 'users', label: 'Join Study Group' },
  { icon: 'brain', label: 'AI Code Review' },
  { icon: 'target', label: 'Set Learning Goal' }
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'code':
      return Code;
    case 'users':
      return Users;
    case 'brain':
      return Brain;
    case 'target':
      return Target;
    default:
      return Code;
  }
};

export function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const IconComponent = getIcon(action.icon);
          
          return (
            <Button 
              key={index}
              className="w-full justify-start" 
              variant="outline"
              onClick={action.onClick}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}