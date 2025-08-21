/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChartBar, 
  TrendUp, 
  Target, 
  Clock, 
  Heart,
  Trophy,
  Users,
  Globe
} from '@phosphor-icons/react'

export function DashboardGuide() {
  const features = [
    {
      icon: <TrendUp className="text-primary" size={20} />,
      title: "Impact Tracking",
      description: "See your personal contribution to the community with detailed statistics on people and animals helped."
    },
    {
      icon: <Target className="text-accent" size={20} />,
      title: "Weekly Goals",
      description: "Set and track weekly assistance goals to stay motivated and maintain consistent community support."
    },
    {
      icon: <Clock className="text-green-600" size={20} />,
      title: "Activity Timeline",
      description: "Review your volunteer history with a detailed timeline of all your community assistance activities."
    },
    {
      icon: <Trophy className="text-yellow-600" size={20} />,
      title: "Achievement Streaks",
      description: "Build and maintain daily activity streaks to show consistent commitment to helping others."
    },
    {
      icon: <Globe className="text-blue-600" size={20} />,
      title: "Community Stats",
      description: "View community-wide impact metrics and see how your efforts contribute to the larger movement."
    },
    {
      icon: <Users className="text-purple-600" size={20} />,
      title: "Volunteer Leaderboard",
      description: "See top community helpers and celebrate collective achievements in making a difference."
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ChartBar className="text-primary" size={32} />
          <h2 className="text-2xl font-bold">Volunteer Dashboard</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your community impact, set goals, and see how your compassionate actions create positive change. 
          Every act of kindness matters and contributes to building a more caring society.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-accent" />
            Getting Started with Impact Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="flex-shrink-0">1</Badge>
              <div>
                <p className="font-medium">Report or help with cases</p>
                <p className="text-sm text-muted-foreground">Your dashboard automatically tracks when you report new cases or mark cases as helped.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="flex-shrink-0">2</Badge>
              <div>
                <p className="font-medium">Set your weekly goal</p>
                <p className="text-sm text-muted-foreground">Use the + and - buttons on your weekly goal tracker to set a realistic target for community assistance.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="flex-shrink-0">3</Badge>
              <div>
                <p className="font-medium">Monitor your impact</p>
                <p className="text-sm text-muted-foreground">View detailed statistics on the Impact tab, track your activity timeline, and see community-wide progress.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Heart className="text-primary flex-shrink-0 mt-1" size={16} />
              <div className="text-sm">
                <p className="font-medium text-foreground">Remember: Every action counts</p>
                <p className="text-muted-foreground">
                  Whether you're reporting someone in need, providing direct assistance, or helping coordinate resources, 
                  your compassionate actions create ripple effects that strengthen our entire community.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}