/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  MapPin, 
  Plus, 
  Bell, 
  CheckCircle, 
  Info,
  PhoneCall,
  Users
} from '@phosphor-icons/react';

export function QuickStartGuide() {
  const steps = [
    {
      icon: MapPin,
      title: "See someone who needs help?",
      description: "If you encounter someone experiencing homelessness or a stray animal that needs assistance",
      action: "Report their location and needs",
      color: "primary"
    },
    {
      icon: Bell,
      title: "Want to help others?",
      description: "Set up notifications to receive alerts when people or animals need help in your area",
      action: "Configure your volunteer settings",
      color: "accent"
    },
    {
      icon: Users,
      title: "Respond to requests",
      description: "When you see a case you can help with, mark it as 'in progress' and provide assistance",
      action: "Browse current cases",
      color: "success"
    },
    {
      icon: CheckCircle,
      title: "Make a difference",
      description: "After helping, mark the case as 'helped' to let the community know",
      action: "Track your impact",
      color: "success"
    }
  ];

  const emergencyInfo = [
    {
      situation: "Medical emergency",
      action: "Call emergency services immediately",
      note: "Life-threatening situations require professional help"
    },
    {
      situation: "Severe weather",
      action: "Direct to nearest shelter or warming center",
      note: "Know your local emergency shelter locations"
    },
    {
      situation: "Mental health crisis",
      action: "Contact mental health crisis line",
      note: "Many areas have 24/7 mental health support"
    },
    {
      situation: "Injured animal",
      action: "Contact local animal control or vet",
      note: "Don't attempt to move seriously injured animals"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="mr-2" size={16} />
          Quick Start Guide
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="text-primary" weight="fill" />
            How SolidarityMap-AI Works
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.color === 'primary' ? 'bg-primary text-primary-foreground' :
                    step.color === 'accent' ? 'bg-accent text-accent-foreground' :
                    'bg-green-600 text-white'
                  }`}>
                    <step.icon size={20} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {step.action}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PhoneCall className="text-destructive" />
                Emergency Situations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                Always contact professional emergency services for life-threatening situations. 
                This platform is for community support, not emergency response.
              </p>
              
              <div className="space-y-3">
                {emergencyInfo.map((item, index) => (
                  <div key={index} className="border-l-4 border-destructive pl-3">
                    <div className="font-medium text-sm">{item.situation}</div>
                    <div className="text-sm text-muted-foreground">{item.action}</div>
                    <div className="text-xs text-muted-foreground italic">{item.note}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={16} />
                <span><strong>Respect dignity:</strong> Treat everyone with compassion and respect</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={16} />
                <span><strong>Prioritize safety:</strong> Both your safety and others' safety come first</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={16} />
                <span><strong>Be accurate:</strong> Provide clear, factual information in reports</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={16} />
                <span><strong>Follow through:</strong> Update case status to help coordinate community response</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={16} />
                <span><strong>Know your limits:</strong> Only offer help you can safely and appropriately provide</span>
              </div>
            </CardContent>
          </Card>

          {/* What You Can Do */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ways to Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">For People:</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Food and water</li>
                    <li>• Warm clothing/blankets</li>
                    <li>• Hygiene items</li>
                    <li>• Information about local services</li>
                    <li>• Transportation assistance</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">For Animals:</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Food and water</li>
                    <li>• Temporary shelter</li>
                    <li>• Veterinary care</li>
                    <li>• Transport to animal services</li>
                    <li>• Reporting to animal control</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}