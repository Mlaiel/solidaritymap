/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, MapPin, Heart, Users, Filter, Flag } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Case {
  id: string
  lat: number
  lng: number
  category: 'homeless' | 'animal'
  description: string
  status: 'active' | 'in-progress' | 'completed'
  createdAt: number
  helpedBy?: string
  urgency: 'low' | 'medium' | 'high'
}

interface MapViewport {
  lat: number
  lng: number
  zoom: number
}

export default function App() {
  const [cases, setCases] = useKV<Case[]>('solidarity-cases', [])
  const [viewport, setViewport] = useState<MapViewport>({
    lat: 37.7749,
    lng: -122.4194,
    zoom: 12
  })
  const [filter, setFilter] = useState<'all' | 'homeless' | 'animal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in-progress' | 'completed'>('active')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setViewport(prev => ({ ...prev, ...location }))
        },
        (error) => {
          console.log('Location access denied:', error)
          toast.error('Location access needed for full functionality')
        }
      )
    }
  }, [])

  const filteredCases = cases.filter(c => {
    const categoryMatch = filter === 'all' || c.category === filter
    const statusMatch = statusFilter === 'all' || c.status === statusFilter
    return categoryMatch && statusMatch
  })

  const addCase = (caseData: Omit<Case, 'id' | 'createdAt' | 'status'>) => {
    const newCase: Case = {
      ...caseData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'active'
    }
    
    setCases(currentCases => [...currentCases, newCase])
    setShowAddDialog(false)
    toast.success('Case added successfully - help is on the way!')
  }

  const helpCase = (caseId: string) => {
    setCases(currentCases => 
      currentCases.map(c => 
        c.id === caseId 
          ? { ...c, status: 'in-progress', helpedBy: 'volunteer' }
          : c
      )
    )
    toast.success('Thank you for helping! Please mark complete when finished.')
  }

  const completeCase = (caseId: string) => {
    setCases(currentCases => 
      currentCases.map(c => 
        c.id === caseId 
          ? { ...c, status: 'completed' }
          : c
      )
    )
    toast.success('Case marked complete - thank you for making a difference!')
  }

  const getCategoryIcon = (category: string) => {
    return category === 'homeless' ? '🏠' : '🐕'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-accent text-accent-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'in-progress': return 'bg-yellow-500 text-black'
      default: return 'bg-primary text-primary-foreground'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-primary-foreground">
              <Heart weight="fill" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SolidarityMap-AI</h1>
              <p className="text-sm text-muted-foreground">Community care platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users size={16} />
              {cases.filter(c => c.status === 'completed').length} helped
            </Badge>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-border p-4 bg-card">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-muted-foreground" />
            <Label className="text-sm font-medium">Filters:</Label>
          </div>
          
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="homeless">🏠 Homeless</SelectItem>
              <SelectItem value="animal">🐕 Animals</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active Cases</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="all">All Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-primary" />
                  Community Map
                </CardTitle>
                
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={20} />
                      Add Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report a Case for Community Help</DialogTitle>
                    </DialogHeader>
                    <AddCaseForm onSubmit={addCase} userLocation={userLocation} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin size={48} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive map will load here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filteredCases.length} cases {statusFilter !== 'all' ? `(${statusFilter})` : ''}
                    </p>
                  </div>
                  
                  {/* Mock map markers */}
                  <div className="absolute inset-4 grid grid-cols-4 gap-4 pointer-events-none">
                    {filteredCases.slice(0, 8).map((case_, idx) => (
                      <div 
                        key={case_.id}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${getStatusColor(case_.status)} opacity-80`}
                        style={{
                          gridColumn: (idx % 4) + 1,
                          gridRow: Math.floor(idx / 4) + 1
                        }}
                      >
                        {getCategoryIcon(case_.category)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Cases ({filteredCases.length})
            </h2>
            
            {filteredCases.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Heart size={48} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No cases found</p>
                  <p className="text-sm text-muted-foreground">Add a case to help someone in need</p>
                </CardContent>
              </Card>
            ) : (
              filteredCases.map(case_ => (
                <CaseCard 
                  key={case_.id}
                  case_={case_}
                  onHelp={helpCase}
                  onComplete={completeCase}
                  onSelect={setSelectedCase}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12 p-6">
        <div className="max-w-7xl mx-auto text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            SolidarityMap-AI - Building community through compassionate technology
          </p>
          <p className="text-xs text-muted-foreground">
            Owner: Fahed Mlaiel | Contact: mlaiel@live.de | Open source with attribution required
          </p>
          <p className="text-xs text-muted-foreground">
            Emergency? Call local services. This platform supplements but doesn't replace emergency care.
          </p>
        </div>
      </footer>
    </div>
  )
}

function AddCaseForm({ onSubmit, userLocation }: { 
  onSubmit: (data: Omit<Case, 'id' | 'createdAt' | 'status'>) => void
  userLocation: {lat: number, lng: number} | null 
}) {
  const [category, setCategory] = useState<'homeless' | 'animal'>('homeless')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      toast.error('Please add a description')
      return
    }

    const location = userLocation || { lat: 37.7749, lng: -122.4194 }
    
    onSubmit({
      ...location,
      category,
      description: description.trim(),
      urgency
    })

    setDescription('')
    setUrgency('medium')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>What kind of help is needed?</Label>
        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="homeless">🏠 Homeless person needs help</SelectItem>
            <SelectItem value="animal">🐕 Stray animal needs help</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Urgency Level</Label>
        <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low - General assistance needed</SelectItem>
            <SelectItem value="medium">Medium - Prompt help needed</SelectItem>
            <SelectItem value="high">High - Urgent assistance required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe what help is needed (food, blankets, medical care, etc.)"
          className="min-h-20"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" className="flex items-center gap-2">
          <Heart />
          Add Case
        </Button>
      </div>
    </form>
  )
}

function CaseCard({ 
  case_, 
  onHelp, 
  onComplete, 
  onSelect 
}: { 
  case_: Case
  onHelp: (id: string) => void
  onComplete: (id: string) => void
  onSelect: (case_: Case) => void
}) {
  const timeAgo = Math.floor((Date.now() - case_.createdAt) / (1000 * 60))
  
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(case_)}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCategoryIcon(case_.category)}</span>
            <Badge className={getUrgencyColor(case_.urgency)}>
              {case_.urgency}
            </Badge>
          </div>
          <Badge className={getStatusColor(case_.status)}>
            {case_.status}
          </Badge>
        </div>
        
        <p className="text-sm text-foreground mb-3 line-clamp-2">
          {case_.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo/60)}h ago`}</span>
          <span>📍 Nearby</span>
        </div>

        {case_.status === 'active' && (
          <Button 
            onClick={(e) => { e.stopPropagation(); onHelp(case_.id) }}
            size="sm" 
            className="w-full flex items-center gap-2"
          >
            <Heart size={16} />
            I Can Help
          </Button>
        )}

        {case_.status === 'in-progress' && (
          <Button 
            onClick={(e) => { e.stopPropagation(); onComplete(case_.id) }}
            size="sm" 
            variant="outline"
            className="w-full"
          >
            Mark Complete
          </Button>
        )}

        {case_.status === 'completed' && (
          <div className="text-center text-sm text-green-600 font-medium">
            ✅ Help provided - Thank you!
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getCategoryIcon(category: string) {
  return category === 'homeless' ? '🏠' : '🐕'
}

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'high': return 'bg-destructive text-destructive-foreground'
    case 'medium': return 'bg-accent text-accent-foreground'
    default: return 'bg-secondary text-secondary-foreground'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-500 text-white'
    case 'in-progress': return 'bg-yellow-500 text-black'
    default: return 'bg-primary text-primary-foreground'
  }
}