/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MapPin, Users } from '@phosphor-icons/react'
import { toast } from 'sonner'

// Test component to check if basic React functionality works
export default function App() {
  const [testState, setTestState] = useState<string>('App loaded successfully!')
  const [counter, setCounter] = useState<number>(0)

  useEffect(() => {
    console.log('App component mounted')
    toast.success('SolidarityMap-AI initialized')
  }, [])

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
              Ready to help
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-primary" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">{testState}</p>
              <p className="text-sm text-muted-foreground">Counter: {counter}</p>
              <Button 
                onClick={() => setCounter(prev => prev + 1)}
                className="w-full"
              >
                Test Counter ({counter})
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>About SolidarityMap-AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A community-driven platform to help homeless individuals and stray animals 
                by connecting those in need with local volunteers ready to assist.
              </p>
              <Button 
                variant="outline" 
                onClick={() => toast.info('Full functionality coming soon!')}
                className="w-full"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
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

