/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  MapPin, 
  Heart, 
  Paw, 
  Clock,
  Volume2,
  VolumeX,
  Settings
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { NotificationPreferences } from '@/lib/types';
import { useKV } from '@github/spark/hooks';

export function VolunteerSettings() {
  const [notifications, setNotifications] = useKV<NotificationPreferences>('volunteer-notifications', {
    enabled: true,
    radius: 5,
    categories: ['homeless', 'animal'],
    urgencyLevels: ['medium', 'high'],
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    }
  });

  const [accessibilitySettings, setAccessibilitySettings] = useKV('accessibility-settings', {
    screenReader: false,
    voiceInput: false,
    highContrast: false,
    largeText: false
  });

  const updateNotifications = (updates: Partial<NotificationPreferences>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
    toast.success('Notification preferences updated');
  };

  const updateAccessibility = (key: string, value: boolean) => {
    setAccessibilitySettings(prev => ({ ...prev, [key]: value }));
    toast.success('Accessibility settings updated');
  };

  const toggleCategory = (category: 'homeless' | 'animal') => {
    const currentCategories = notifications.categories;
    let newCategories;
    
    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter(c => c !== category);
    } else {
      newCategories = [...currentCategories, category];
    }
    
    updateNotifications({ categories: newCategories });
  };

  const toggleUrgency = (urgency: 'low' | 'medium' | 'high') => {
    const currentLevels = notifications.urgencyLevels;
    let newLevels;
    
    if (currentLevels.includes(urgency)) {
      newLevels = currentLevels.filter(l => l !== urgency);
    } else {
      newLevels = [...currentLevels, urgency];
    }
    
    updateNotifications({ urgencyLevels: newLevels });
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="text-primary" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when people or animals need help nearby
              </p>
            </div>
            <Switch
              checked={notifications.enabled}
              onCheckedChange={(checked) => updateNotifications({ enabled: checked })}
              aria-label="Enable notifications"
            />
          </div>

          {notifications.enabled && (
            <>
              <Separator />
              
              {/* Notification Radius */}
              <div className="space-y-3">
                <Label className="font-medium">Alert Radius</Label>
                <div className="px-3">
                  <Slider
                    value={[notifications.radius]}
                    onValueChange={([value]) => updateNotifications({ radius: value })}
                    min={1}
                    max={20}
                    step={1}
                    className="w-full"
                    aria-label="Notification radius in kilometers"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1km</span>
                    <span className="font-medium">{notifications.radius}km</span>
                    <span>20km</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be notified about cases within {notifications.radius}km of your location
                </p>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-3">
                <Label className="font-medium">Who would you like to help?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      notifications.categories.includes('homeless')
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleCategory('homeless')}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Heart size={18} className={notifications.categories.includes('homeless') ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="font-medium text-sm">People</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Individuals experiencing homelessness
                    </p>
                  </div>
                  
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      notifications.categories.includes('animal')
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleCategory('animal')}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Paw size={18} className={notifications.categories.includes('animal') ? 'text-primary' : 'text-muted-foreground'} />
                      <span className="font-medium text-sm">Animals</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Stray or injured animals
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Urgency Levels */}
              <div className="space-y-3">
                <Label className="font-medium">Urgency Levels</Label>
                <div className="space-y-2">
                  {[
                    { level: 'high' as const, label: 'High', desc: 'Urgent situations requiring immediate help', color: 'destructive' },
                    { level: 'medium' as const, label: 'Medium', desc: 'Situations needing attention soon', color: 'default' },
                    { level: 'low' as const, label: 'Low', desc: 'General assistance requests', color: 'secondary' }
                  ].map(({ level, label, desc, color }) => (
                    <div 
                      key={level}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        notifications.urgencyLevels.includes(level)
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleUrgency(level)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={color as any} className="text-xs">
                            {label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 ${
                        notifications.urgencyLevels.includes(level) 
                          ? 'border-primary bg-primary' 
                          : 'border-muted-foreground'
                      }`}>
                        {notifications.urgencyLevels.includes(level) && (
                          <div className="w-full h-full bg-primary-foreground rounded-sm scale-50"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Pause non-urgent notifications during specific hours
                    </p>
                  </div>
                  <Switch
                    checked={notifications.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      updateNotifications({ 
                        quietHours: { ...notifications.quietHours, enabled: checked }
                      })
                    }
                  />
                </div>

                {notifications.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Start time</Label>
                      <Select 
                        value={notifications.quietHours.start} 
                        onValueChange={(value) => 
                          updateNotifications({ 
                            quietHours: { ...notifications.quietHours, start: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">End time</Label>
                      <Select 
                        value={notifications.quietHours.end} 
                        onValueChange={(value) => 
                          updateNotifications({ 
                            quietHours: { ...notifications.quietHours, end: value }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="text-primary" />
            Accessibility Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: 'screenReader',
              label: 'Screen Reader Support',
              description: 'Enhanced support for screen reading software',
              icon: Volume2
            },
            {
              key: 'voiceInput',
              label: 'Voice Input',
              description: 'Use voice commands for reporting cases',
              icon: Volume2
            },
            {
              key: 'highContrast',
              label: 'High Contrast Mode',
              description: 'Increase visual contrast for better readability',
              icon: Settings
            },
            {
              key: 'largeText',
              label: 'Large Text',
              description: 'Increase font sizes throughout the app',
              icon: Settings
            }
          ].map(({ key, label, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Icon className="text-muted-foreground mt-1" size={20} />
                <div>
                  <Label className="font-medium">{label}</Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <Switch
                checked={accessibilitySettings[key]}
                onCheckedChange={(checked) => updateAccessibility(key, checked)}
                aria-label={label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {notifications.enabled ? (
                <Bell className="text-green-600" size={20} />
              ) : (
                <BellOff className="text-muted-foreground" size={20} />
              )}
              <span className="font-medium">
                {notifications.enabled ? 'Ready to help' : 'Notifications disabled'}
              </span>
            </div>
            {notifications.enabled && (
              <p className="text-sm text-muted-foreground">
                You'll receive alerts for {notifications.categories.join(' and ')} cases 
                within {notifications.radius}km
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}