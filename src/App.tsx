/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  Heart, 
  MapPin, 
  Users, 
  List, 
  Plus, 
  Settings, 
  Bell,
  Info,
  Phone,
  Shield,
  ChartBar
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { CaseReport, VolunteerActivity } from '@/lib/types'
import { ReportCase } from '@/components/ReportCase'
import { CaseList } from '@/components/CaseList'
import { VolunteerSettings } from '@/components/VolunteerSettings'
import { QuickStartGuide } from '@/components/QuickStartGuide'
import { VoiceControls } from '@/components/VoiceControls'
import { DebugInfo } from '@/components/DebugInfo'
import { VolunteerDashboard } from '@/components/VolunteerDashboard'
import { sampleCases } from '@/lib/sampleData'

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('cases')
  const [cases, setCases] = useKV<CaseReport[]>('solidarity-cases', [])
  const [activities, setActivities] = useKV<VolunteerActivity[]>('volunteer-activities', [])
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    helped: 0
  })

  // Calculate statistics
  useEffect(() => {
    const newStats = {
      total: cases.length,
      open: cases.filter(c => c.status === 'open').length,
      inProgress: cases.filter(c => c.status === 'in-progress').length,
      helped: cases.filter(c => c.status === 'helped').length
    }
    setStats(newStats)
  }, [cases])

  const handleCaseUpdate = (updatedCase: CaseReport) => {
    // Create activity record for status changes
    if (updatedCase.status === 'helped' || updatedCase.status === 'in-progress') {
      const newActivity: VolunteerActivity = {
        id: `activity-${Date.now()}`,
        volunteerId: 'current-volunteer',
        caseId: updatedCase.id,
        action: updatedCase.status === 'helped' ? 'helped' : 'started-helping',
        timestamp: new Date().toISOString(),
        location: updatedCase.location,
        notes: `${updatedCase.status === 'helped' ? 'Completed' : 'Started'} assistance for ${updatedCase.type} case`
      }
      
      setActivities((currentActivities) => [...currentActivities, newActivity])
    }
    
    setCases((currentCases) => 
      currentCases.map(c => c.id === updatedCase.id ? updatedCase : c)
    )
  }

  const handleNewReport = (newReport: CaseReport) => {
    // Create activity record for new reports
    const newActivity: VolunteerActivity = {
      id: `activity-${Date.now()}`,
      volunteerId: 'current-volunteer',
      caseId: newReport.id,
      action: 'reported',
      timestamp: new Date().toISOString(),
      location: newReport.location,
      notes: `Reported new ${newReport.type} case`
    }
    
    setActivities((currentActivities) => [...currentActivities, newActivity])
    
    // Case already added to storage in ReportCase component
    // Just need to trigger a re-render by updating local state
    setCases((currentCases) => [...currentCases])
  }

  const loadSampleData = () => {
    setCases(sampleCases)
    
    // Create sample activities
    const sampleActivities: VolunteerActivity[] = [
      {
        id: 'sample-activity-1',
        volunteerId: 'current-volunteer',
        caseId: sampleCases[0]?.id || 'sample-1',
        action: 'helped',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: sampleCases[0]?.location || { lat: 40.7128, lng: -74.0060 },
        notes: 'Provided food and blankets'
      },
      {
        id: 'sample-activity-2',
        volunteerId: 'current-volunteer',
        caseId: sampleCases[1]?.id || 'sample-2',
        action: 'started-helping',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: sampleCases[1]?.location || { lat: 40.7589, lng: -73.9851 },
        notes: 'Contacted local animal rescue'
      },
      {
        id: 'sample-activity-3',
        volunteerId: 'current-volunteer',
        caseId: sampleCases[2]?.id || 'sample-3',
        action: 'reported',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: sampleCases[2]?.location || { lat: 40.7505, lng: -73.9934 },
        notes: 'Reported person needing assistance'
      }
    ]
    
    setActivities(sampleActivities)
    toast.success('Sample data loaded for demo purposes')
  }

  useEffect(() => {
    console.log('SolidarityMap-AI initialized')
    toast.success('SolidarityMap-AI ready to help build community')
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl text-primary-foreground">
                <Heart weight="fill" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SolidarityMap-AI</h1>
                <p className="text-sm text-muted-foreground">Community care platform</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total cases</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <div className="text-lg font-bold text-accent">{stats.helped}</div>
                <div className="text-xs text-muted-foreground">Helped</div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Badge variant={stats.open > 0 ? "destructive" : "secondary"} className="flex items-center gap-1">
                <Bell size={14} />
                {stats.open} need help
              </Badge>
            </div>

            {/* Voice Controls */}
            <div className="hidden md:block">
              <VoiceControls />
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="md:hidden mt-4 grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-bold text-accent">{stats.helped}</div>
              <div className="text-xs text-muted-foreground">Helped</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-bold text-destructive">{stats.open}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-4 sm:grid-cols-4">
              <TabsTrigger value="cases" className="flex items-center gap-2">
                <List size={16} />
                <span className="hidden sm:inline">Cases</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <ChartBar size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <Plus size={16} />
                <span className="hidden sm:inline">Report</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <QuickStartGuide />
              {activeTab === 'cases' && (
                <ReportCase onReportSubmitted={handleNewReport} />
              )}
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value="cases" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Community Assistance Requests</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Live updates
                  </Badge>
                  {cases.length === 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadSampleData}
                    >
                      Load Sample Data
                    </Button>
                  )}
                </div>
              </div>
              <CaseList cases={cases} onCaseUpdate={handleCaseUpdate} />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <VolunteerDashboard cases={cases} activities={activities} />
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Report Someone Who Needs Help</h2>
                <p className="text-muted-foreground">
                  Help connect community members with those who need assistance
                </p>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <ReportCase onReportSubmitted={handleNewReport} />
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Info className="text-primary" />
                    Reporting Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Shield className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <strong>Respect dignity:</strong> Always approach with compassion and respect for privacy
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <strong>Be accurate:</strong> Provide clear, factual descriptions of assistance needed
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <strong>Emergency first:</strong> For life-threatening situations, call emergency services immediately
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Volunteer Preferences</h2>
                <p className="text-muted-foreground">
                  Customize your experience and notification settings
                </p>
              </div>
              <VolunteerSettings />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* About */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="text-primary" size={18} />
                About SolidarityMap-AI
              </h3>
              <p className="text-sm text-muted-foreground">
                A community-driven platform connecting those who need help with volunteers ready to assist. 
                Building solidarity through compassionate technology.
              </p>
            </div>

            {/* Emergency Notice */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="text-destructive" size={18} />
                Emergency Notice
              </h3>
              <p className="text-sm text-muted-foreground">
                For life-threatening emergencies, always contact local emergency services first. 
                This platform supplements but does not replace professional emergency response.
              </p>
            </div>

            {/* Attribution */}
            <div className="space-y-3">
              <h3 className="font-semibold">Open Source</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Owner:</strong> Fahed Mlaiel</p>
                <p><strong>Contact:</strong> mlaiel@live.de</p>
                <p className="text-xs">
                  Attribution required in all copies, forks, and derivatives. 
                  Free for non-commercial use.
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center justify-between">
            <div className="text-center text-xs text-muted-foreground">
              SolidarityMap-AI © 2024 - Building community through compassionate technology
            </div>
            <DebugInfo cases={cases} onDataReset={() => setCases([])} />
          </div>
        </div>
      </footer>
    </div>
  )
}

