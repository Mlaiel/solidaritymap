/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  TrendUp, 
  Heart, 
  MapPin, 
  Clock, 
  Target, 
  Award,
  Users,
  Calendar,
  ChartBar,
  Fire,
  Globe,
  PawPrint,
  Handshake
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { CaseReport, VolunteerActivity, ImpactStats, CommunityStats } from '@/lib/types'
import { calculateImpactStats, calculateCommunityStats } from '@/lib/statistics'
import { ImpactChart } from '@/components/ImpactChart'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { DashboardGuide } from '@/components/DashboardGuide'
import { toast } from 'sonner'

interface VolunteerDashboardProps {
  cases: CaseReport[]
  activities: VolunteerActivity[]
}

export function VolunteerDashboard({ cases, activities }: VolunteerDashboardProps) {
  const [storedActivities, setStoredActivities] = useKV<VolunteerActivity[]>('volunteer-activities', [])
  const [weeklyGoal, setWeeklyGoal] = useKV<number>('weekly-goal', 5)
  
  // Use passed activities or stored activities if available
  const allActivities = activities.length > 0 ? activities : storedActivities
  const [impactStats, setImpactStats] = useState<ImpactStats>({
    totalCasesHelped: 0,
    totalReports: 0,
    peopleHelped: 0,
    animalsHelped: 0,
    activeStreak: 0,
    averageResponseTime: 0,
    mostActiveCategory: null,
    weeklyGoal: 5,
    weeklyProgress: 0
  })
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalVolunteers: 0,
    activeCases: 0,
    casesResolvedToday: 0,
    casesResolvedThisWeek: 0,
    casesResolvedThisMonth: 0,
    averageResolutionTime: 0,
    topVolunteers: []
  })

  // Calculate impact statistics
  useEffect(() => {
    const calculatedStats = calculateImpactStats(cases, allActivities)
    const newStats: ImpactStats = {
      ...calculatedStats,
      weeklyGoal,
      weeklyProgress: calculatedStats.weeklyProgress
    }
    setImpactStats(newStats)
  }, [cases, allActivities, weeklyGoal])

  // Calculate community statistics
  useEffect(() => {
    const newCommunityStats = calculateCommunityStats(cases)
    setCommunityStats(newCommunityStats)
  }, [cases, impactStats.totalCasesHelped])

  const updateWeeklyGoal = (newGoal: number) => {
    setWeeklyGoal(newGoal)
    toast.success(`Weekly goal updated to ${newGoal} cases`)
  }

  const progressPercentage = Math.min((impactStats.weeklyProgress / impactStats.weeklyGoal) * 100, 100)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChartBar className="text-primary" />
              Volunteer Dashboard
            </h2>
            <p className="text-muted-foreground">
              Track your impact and community contributions
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Fire className="text-accent" size={14} />
            {impactStats.activeStreak} day streak
          </Badge>
        </div>

        {/* Weekly Goal Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="text-primary" size={20} />
                  <span className="font-semibold">Weekly Goal Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => updateWeeklyGoal(weeklyGoal - 1)}
                    disabled={weeklyGoal <= 1}
                  >
                    -
                  </Button>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {impactStats.weeklyProgress}/{impactStats.weeklyGoal}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => updateWeeklyGoal(weeklyGoal + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{impactStats.weeklyProgress} helped this week</span>
                <span>{Math.max(0, impactStats.weeklyGoal - impactStats.weeklyProgress)} to go</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="impact" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <TrendUp size={16} />
            Impact
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock size={16} />
            Activity
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Globe size={16} />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Impact Tab */}
        <TabsContent value="impact" className="space-y-6">
          {cases.length === 0 && allActivities.length === 0 ? (
            <DashboardGuide />
          ) : (
            <>
              {/* Key Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Helped</p>
                        <p className="text-2xl font-bold text-accent">{impactStats.totalCasesHelped}</p>
                      </div>
                      <Heart className="text-accent" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">People Helped</p>
                        <p className="text-2xl font-bold text-primary">{impactStats.peopleHelped}</p>
                      </div>
                      <Users className="text-primary" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Animals Helped</p>
                        <p className="text-2xl font-bold text-orange-500">{impactStats.animalsHelped}</p>
                      </div>
                      <PawPrint className="text-orange-500" size={24} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <p className="text-2xl font-bold text-green-600">{impactStats.averageResponseTime}m</p>
                      </div>
                      <Clock className="text-green-600" size={24} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Impact Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Impact Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImpactChart cases={cases} />
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="text-primary" size={16} />
                        <span className="text-sm">Homeless Assistance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{impactStats.peopleHelped}</span>
                        <Progress 
                          value={(impactStats.peopleHelped / Math.max(impactStats.totalCasesHelped, 1)) * 100} 
                          className="w-20 h-2" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PawPrint className="text-orange-500" size={16} />
                        <span className="text-sm">Animal Care</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{impactStats.animalsHelped}</span>
                        <Progress 
                          value={(impactStats.animalsHelped / Math.max(impactStats.totalCasesHelped, 1)) * 100} 
                          className="w-20 h-2" 
                        />
                      </div>
                    </div>
                  </div>
                  {impactStats.mostActiveCategory && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="text-accent" size={16} />
                        <span>Most active in <strong>{impactStats.mostActiveCategory}</strong> assistance</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <ActivityTimeline activities={allActivities} cases={cases} />
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          {/* Community Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Volunteers</p>
                    <p className="text-2xl font-bold text-primary">{communityStats.totalVolunteers}</p>
                  </div>
                  <Users className="text-primary" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Cases</p>
                    <p className="text-2xl font-bold text-destructive">{communityStats.activeCases}</p>
                  </div>
                  <MapPin className="text-destructive" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved Today</p>
                    <p className="text-2xl font-bold text-success">{communityStats.casesResolvedToday}</p>
                  </div>
                  <Calendar className="text-success" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Community Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Week's Community Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cases Resolved</span>
                    <span className="font-mono">{communityStats.casesResolvedThisWeek}</span>
                  </div>
                  <Progress value={(communityStats.casesResolvedThisWeek / 50) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Resolution Time</span>
                    <span className="font-mono">{Math.round(communityStats.averageResolutionTime / 60)}h {communityStats.averageResolutionTime % 60}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Community Helpers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communityStats.topVolunteers.map((volunteer, index) => (
                    <div key={volunteer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{volunteer.name}</span>
                        {index === 0 && <Badge variant="secondary" className="text-xs">You</Badge>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{volunteer.casesHelped}</span>
                        <Handshake size={14} className="text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Community Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{communityStats.casesResolvedThisMonth}</div>
                  <div className="text-sm text-muted-foreground">Cases Resolved This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{Math.round(communityStats.casesResolvedThisMonth / 30 * 7)}</div>
                  <div className="text-sm text-muted-foreground">Weekly Average</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}