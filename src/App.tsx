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
  Gear, 
  Bell,
  Info,
  Phone,
  Shield,
  ChartBar,
  UserCircle
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { CaseReport, VolunteerActivity, VolunteerProfile as VolunteerProfileType } from '@/lib/types'
import { ReportCase } from '@/components/ReportCase'
import { CaseList } from '@/components/CaseList'
import { VolunteerSettings } from '@/components/VolunteerSettings'
import { QuickStartGuide } from '@/components/QuickStartGuide'
import { VoiceControls } from '@/components/VoiceControls'
import { DebugInfo } from '@/components/DebugInfo'
import { VolunteerDashboard } from '@/components/VolunteerDashboard'
import { VolunteerDirectory } from '@/components/VolunteerDirectory'
import { VolunteerProfile } from '@/components/VolunteerProfile'
import { EditVolunteerProfile } from '@/components/EditVolunteerProfile'
import { LanguageSelector } from '@/components/LanguageSelector'
import { LanguageTest } from '@/components/LanguageTest'
import { sampleCases, sampleVolunteerProfiles } from '@/lib/sampleData'
import { useTranslation } from '@/hooks/useTranslation'

export default function App() {
  const { t, isLoading } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('cases')
  const [cases, setCases] = useKV<CaseReport[]>('solidarity-cases', [])
  const [activities, setActivities] = useKV<VolunteerActivity[]>('volunteer-activities', [])
  const [volunteers, setVolunteers] = useKV<VolunteerProfileType[]>('volunteer-profiles', [])
  const [currentVolunteerId, setCurrentVolunteerId] = useState('volunteer-1') // Mock current user
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    helped: 0
  })

  // Calculate statistics
  useEffect(() => {
    const safeCases = cases || [];
    const newStats = {
      total: safeCases.length,
      open: safeCases.filter(c => c.status === 'open').length,
      inProgress: safeCases.filter(c => c.status === 'in-progress').length,
      helped: safeCases.filter(c => c.status === 'helped').length
    }
    setStats(newStats)
  }, [cases])

  const handleCaseUpdate = (updatedCase: CaseReport) => {
    // Create activity record for status changes
    if (updatedCase.status === 'helped' || updatedCase.status === 'in-progress') {
      const newActivity: VolunteerActivity = {
        id: `activity-${Date.now()}`,
        volunteerId: currentVolunteerId,
        caseId: updatedCase.id,
        action: updatedCase.status === 'helped' ? 'helped' : 'started-helping',
        timestamp: new Date().toISOString(),
        location: updatedCase.location,
        notes: `${updatedCase.status === 'helped' ? t('app.completed') : t('app.started')} ${t('app.assistanceFor')} ${updatedCase.type} ${t('app.case')}`
      }
      
      setActivities((currentActivities) => [...(currentActivities || []), newActivity])
    }
    
    setCases((currentCases) => 
      (currentCases || []).map(c => c.id === updatedCase.id ? updatedCase : c)
    )
  }

  const handleNewReport = (newReport: CaseReport) => {
    // Create activity record for new reports
    const newActivity: VolunteerActivity = {
      id: `activity-${Date.now()}`,
      volunteerId: currentVolunteerId,
      caseId: newReport.id,
      action: 'reported',
      timestamp: new Date().toISOString(),
      location: newReport.location,
      notes: `Reported new ${newReport.type} case`
    }
    
    setActivities((currentActivities) => [...(currentActivities || []), newActivity])
    
    // Case already added to storage in ReportCase component
    // Just need to trigger a re-render by updating local state
    setCases((currentCases) => [...(currentCases || [])])
  }

  const loadSampleData = () => {
    setCases(sampleCases)
    setVolunteers(sampleVolunteerProfiles)
    
    // Create sample activities
    const sampleActivities: VolunteerActivity[] = [
      {
        id: 'sample-activity-1',
        volunteerId: 'volunteer-1',
        caseId: sampleCases[0]?.id || 'sample-1',
        action: 'helped',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: sampleCases[0]?.location || { lat: 40.7128, lng: -74.0060 },
        notes: 'Provided food and blankets'
      },
      {
        id: 'sample-activity-2',
        volunteerId: 'volunteer-2',
        caseId: sampleCases[1]?.id || 'sample-2',
        action: 'started-helping',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: sampleCases[1]?.location || { lat: 40.7589, lng: -73.9851 },
        notes: 'Contacted local animal rescue'
      },
      {
        id: 'sample-activity-3',
        volunteerId: 'volunteer-1',
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
      {/* Mobile-First Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
        <div className="container max-w-7xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl text-primary-foreground">
                <Heart weight="fill" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{t('header.title')}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{t('header.subtitle')}</p>
              </div>
            </div>
            
            {/* Mobile Stats */}
            <div className="flex items-center gap-1 sm:gap-3">
              <LanguageSelector />
              <div className="text-center px-2 py-1 bg-muted rounded-lg">
                <div className="text-sm font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">{t('header.total')}</div>
              </div>
              <div className="text-center px-2 py-1 bg-accent/10 rounded-lg">
                <div className="text-sm font-bold text-accent">{stats.helped}</div>
                <div className="text-xs text-muted-foreground">{t('header.helped')}</div>
              </div>
              {stats.open > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1 text-xs px-2 py-1">
                  <Bell size={12} />
                  {stats.open}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border md:hidden">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <Button
            variant={activeTab === 'cases' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('cases')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-1"
          >
            <List size={18} />
            <span className="text-xs">{t('nav.cases')}</span>
          </Button>
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('dashboard')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-1"
          >
            <ChartBar size={18} />
            <span className="text-xs">{t('nav.stats')}</span>
          </Button>
          <Button
            variant={activeTab === 'report' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('report')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-1 bg-primary text-primary-foreground rounded-full"
          >
            <Plus size={20} />
            <span className="text-xs">{t('nav.report')}</span>
          </Button>
          <Button
            variant={activeTab === 'volunteers' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('volunteers')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-1"
          >
            <Users size={18} />
            <span className="text-xs">{t('nav.people')}</span>
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('settings')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-1"
          >
            <Gear size={18} />
            <span className="text-xs">{t('nav.settings')}</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-3 py-4 pb-20 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Desktop Tab Navigation */}
          <div className="hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-5">
              <TabsTrigger value="cases" className="flex items-center gap-2">
                <List size={16} />
                {t('nav.cases')}
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <ChartBar size={16} />
                {t('nav.dashboard')}
              </TabsTrigger>
              <TabsTrigger value="volunteers" className="flex items-center gap-2">
                <Users size={16} />
                {t('nav.volunteers')}
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <Plus size={16} />
                {t('nav.report')}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Gear size={16} />
                {t('nav.settings')}
              </TabsTrigger>
              <TabsTrigger value="langtest" className="flex items-center gap-2">
                <Info size={16} />
                Lang Test
              </TabsTrigger>
            </TabsList>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <QuickStartGuide />
              <VoiceControls />
              {(volunteers || []).find(v => v.id === currentVolunteerId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedVolunteerId(currentVolunteerId)
                    setActiveTab('volunteers')
                  }}
                  className="flex items-center gap-2"
                >
                  <UserCircle size={20} />
                  My Profile
                </Button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value="cases" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('app.communityAssistanceRequests')}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {t('app.liveUpdates')}
                  </Badge>
                  {((cases || []).length === 0 || (volunteers || []).length === 0) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={loadSampleData}
                    >
                      {t('app.loadSampleData')}
                    </Button>
                  )}
                </div>
              </div>
              <CaseList cases={cases || []} onCaseUpdate={handleCaseUpdate} />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <VolunteerDashboard cases={cases || []} activities={activities || []} />
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            {selectedVolunteerId ? (
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedVolunteerId(null)}
                  className="flex items-center gap-2"
                >
                  ← Back to Volunteers
                </Button>
                
                {(volunteers || []).find(v => v.id === selectedVolunteerId) && (
                  <VolunteerProfile
                    profile={(volunteers || []).find(v => v.id === selectedVolunteerId)!}
                    activities={(activities || []).filter(a => a.volunteerId === selectedVolunteerId)}
                    cases={cases || []}
                    isOwnProfile={selectedVolunteerId === currentVolunteerId}
                    onEditProfile={() => {
                      // Edit handled by EditVolunteerProfile component
                    }}
                  />
                )}
              </div>
            ) : (
              <VolunteerDirectory
                volunteers={volunteers || []}
                onViewProfile={(volunteerId) => setSelectedVolunteerId(volunteerId)}
              />
            )}
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{t('app.reportSomeoneNeedsHelp')}</h2>
                <p className="text-muted-foreground">
                  {t('app.helpConnectCommunity')}
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
                    {t('app.reportingGuidelines')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Shield className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <strong>{t('app.respectDignity')}</strong> {t('app.respectDignityDesc')}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <strong>{t('app.beAccurate')}</strong> {t('app.beAccurateDesc')}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="text-green-600 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <strong>{t('app.emergencyFirst')}</strong> {t('app.emergencyFirstDesc')}
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
                <h2 className="text-2xl font-bold">{t('settings.volunteerPreferencesTitle')}</h2>
                <p className="text-muted-foreground">
                  {t('settings.volunteerPreferencesDesc')}
                </p>
              </div>
              
              {/* Profile Management */}
              {(volunteers || []).find(v => v.id === currentVolunteerId) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCircle className="text-primary" />
                      Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Manage your volunteer profile</h3>
                        <p className="text-sm text-muted-foreground">
                          Update your information, skills, and availability
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedVolunteerId(currentVolunteerId)}
                        >
                          View Profile
                        </Button>
                        <EditVolunteerProfile
                          profile={(volunteers || []).find(v => v.id === currentVolunteerId)!}
                          onSave={(updatedProfile) => {
                            setVolunteers(currentVolunteers => 
                              (currentVolunteers || []).map(v => 
                                v.id === updatedProfile.id ? updatedProfile : v
                              )
                            )
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <VolunteerSettings />
            </div>
          </TabsContent>

          <TabsContent value="langtest" className="space-y-6">
            <LanguageTest />
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
                {t('app.aboutSolidarityMap')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('app.aboutSolidarityMapDesc')}
              </p>
            </div>

            {/* Emergency Notice */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="text-destructive" size={18} />
                {t('app.emergencyNotice')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('app.emergencyNoticeDesc')}
              </p>
            </div>

            {/* Attribution */}
            <div className="space-y-3">
              <h3 className="font-semibold">{t('app.openSource')}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>{t('footer.owner')}:</strong> Fahed Mlaiel</p>
                <p><strong>{t('footer.contact')}:</strong> mlaiel@live.de</p>
                <p className="text-xs">
                  {t('app.attributionRequired')}
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center justify-between">
            <div className="text-center text-xs text-muted-foreground">
              SolidarityMap-AI © 2024 - Building community through compassionate technology
            </div>
            <DebugInfo cases={cases || []} onDataReset={() => setCases([])} />
          </div>
        </div>
      </footer>
    </div>
  )
}

