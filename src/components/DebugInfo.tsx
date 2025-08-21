/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Trash, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Settings,
  Database
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useKV } from '@github/spark/hooks';
import { CaseReport } from '@/lib/types';

interface DebugInfoProps {
  cases: CaseReport[];
  onDataReset: () => void;
}

export function DebugInfo({ cases, onDataReset }: DebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [storedCases, setStoredCases] = useKV<CaseReport[]>('solidarity-cases', []);
  const [notifications, setNotifications] = useKV('volunteer-notifications', {});
  const [accessibility, setAccessibility] = useKV('accessibility-settings', {});

  const clearAllData = () => {
    setStoredCases([]);
    setNotifications({});
    setAccessibility({});
    onDataReset();
    toast.success('All application data cleared');
    setIsOpen(false);
  };

  const exportData = () => {
    const data = {
      cases: storedCases,
      notifications,
      accessibility,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidaritymap-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const dataStats = {
    totalCases: storedCases.length,
    openCases: storedCases.filter(c => c.status === 'open').length,
    helpedCases: storedCases.filter(c => c.status === 'helped').length,
    hasNotificationSettings: Object.keys(notifications).length > 0,
    hasAccessibilitySettings: Object.keys(accessibility).length > 0
  };

  const systemChecks = [
    {
      name: 'Geolocation',
      status: 'geolocation' in navigator,
      description: 'GPS location services'
    },
    {
      name: 'Notifications',
      status: 'Notification' in window,
      description: 'Browser notifications'
    },
    {
      name: 'Speech Recognition',
      status: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      description: 'Voice input support'
    },
    {
      name: 'Speech Synthesis',
      status: 'speechSynthesis' in window,
      description: 'Text-to-speech support'
    },
    {
      name: 'Local Storage',
      status: typeof Storage !== 'undefined',
      description: 'Data persistence'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Code size={16} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="text-primary" />
            Debug Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="text-primary" />
                Data Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Total Cases</div>
                  <div className="text-muted-foreground">{dataStats.totalCases}</div>
                </div>
                <div>
                  <div className="font-medium">Open Cases</div>
                  <div className="text-muted-foreground">{dataStats.openCases}</div>
                </div>
                <div>
                  <div className="font-medium">Helped Cases</div>
                  <div className="text-muted-foreground">{dataStats.helpedCases}</div>
                </div>
                <div>
                  <div className="font-medium">Settings Configured</div>
                  <div className="text-muted-foreground">
                    {(dataStats.hasNotificationSettings ? 1 : 0) + (dataStats.hasAccessibilitySettings ? 1 : 0)}/2
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Compatibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Compatibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {check.status ? (
                      <CheckCircle className="text-green-600" size={16} />
                    ) : (
                      <AlertTriangle className="text-red-600" size={16} />
                    )}
                    <div>
                      <div className="font-medium text-sm">{check.name}</div>
                      <div className="text-xs text-muted-foreground">{check.description}</div>
                    </div>
                  </div>
                  <Badge variant={check.status ? "default" : "destructive"} className="text-xs">
                    {check.status ? 'Supported' : 'Not Available'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={exportData}
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Export Data
                </Button>
                
                <Button 
                  variant="destructive" 
                  onClick={clearAllData}
                  className="flex items-center gap-2"
                >
                  <Trash size={16} />
                  Clear All Data
                </Button>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Clearing data will remove all cases, settings, and preferences. This action cannot be undone.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Build Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Build Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Version:</div>
                <div className="text-muted-foreground">1.0.0</div>
                
                <div className="font-medium">Environment:</div>
                <div className="text-muted-foreground">
                  {process.env.NODE_ENV || 'production'}
                </div>
                
                <div className="font-medium">User Agent:</div>
                <div className="text-muted-foreground text-xs break-all">
                  {navigator.userAgent}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attribution</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><strong>Owner:</strong> Fahed Mlaiel</div>
              <div><strong>Contact:</strong> mlaiel@live.de</div>
              <div className="text-xs text-muted-foreground">
                Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
                Free for non-commercial use. Commercial use requires paid license.
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}