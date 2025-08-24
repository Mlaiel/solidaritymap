/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, MapPin, Camera, Heart, Dog } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useGeolocation, formatDistance } from '@/lib/geolocation';
import { CaseReport, Location } from '@/lib/types';
import { useKV } from '@github/spark/hooks';
import { VoiceControls } from './VoiceControls';

interface ReportCaseProps {
  onReportSubmitted: (report: CaseReport) => void;
}

export function ReportCase({ onReportSubmitted }: ReportCaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'homeless' | 'animal'>('homeless');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cases, setCases] = useKV<CaseReport[]>('solidarity-cases', []);
  
  const { location, error, loading, getCurrentLocation } = useGeolocation();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe the situation');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let reportLocation = location;
      if (!reportLocation) {
        reportLocation = await getCurrentLocation();
      }

      const newReport: CaseReport = {
        id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        location: reportLocation,
        description: description.trim(),
        urgency,
        status: 'open',
        reportedAt: new Date().toISOString(),
        tags: []
      };

      // Add to persistent storage
      setCases((currentCases) => [...(currentCases || []), newReport]);
      
      onReportSubmitted(newReport);
      
      // Reset form
      setDescription('');
      setUrgency('medium');
      setIsOpen(false);
      
      toast.success(`${type === 'homeless' ? 'Person' : 'Animal'} assistance request submitted`);
    } catch (err) {
      toast.error('Failed to submit report. Please try again.');
      console.error('Report submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="default" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
          aria-label="Report someone who needs help"
        >
          <Plus className="w-4 h-4" weight="bold" />
          <span className="hidden sm:inline">Report Need</span>
          <span className="sm:hidden">Report</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" aria-describedby="report-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="text-primary" weight="fill" />
            Report Someone Who Needs Help
          </DialogTitle>
          <p id="report-dialog-description" className="text-sm text-muted-foreground">
            Share the location and details of someone who could use community assistance
          </p>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Location Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" />
              <span className="text-sm font-medium">
                {loading ? 'Getting location...' : location ? 'Location ready' : 'Location needed'}
              </span>
            </div>
            {!location && !loading && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getCurrentLocation}
                disabled={loading}
              >
                Get Location
              </Button>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Case Type */}
          <div className="space-y-2">
            <Label htmlFor="case-type">Who needs help?</Label>
            <Select value={type} onValueChange={(value: 'homeless' | 'animal') => setType(value)}>
              <SelectTrigger id="case-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homeless">
                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    Person experiencing homelessness
                  </div>
                </SelectItem>
                <SelectItem value="animal">
                  <div className="flex items-center gap-2">
                    <Dog size={16} />
                    Stray or injured animal
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">What kind of help is needed?</Label>
              <VoiceControls 
                onVoiceInput={(text) => setDescription(text)}
                disabled={isSubmitting}
              />
            </div>
            <Textarea
              id="description"
              placeholder={type === 'homeless' 
                ? "e.g., Person needs food, warm blanket, or shelter information" 
                : "e.g., Injured dog needs water and veterinary care"
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </div>
          </div>
          
          {/* Urgency */}
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency level</Label>
            <Select value={urgency} onValueChange={(value: 'low' | 'medium' | 'high') => setUrgency(value)}>
              <SelectTrigger id="urgency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center justify-between w-full">
                    <span>Low - General assistance</span>
                    <Badge variant="secondary" className="ml-2">Low</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center justify-between w-full">
                    <span>Medium - Needs attention soon</span>
                    <Badge variant="default" className="ml-2">Medium</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center justify-between w-full">
                    <span>High - Urgent situation</span>
                    <Badge variant="destructive" className="ml-2">High</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !description.trim() || (!location && !loading)}
            className="w-full mt-6"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Reports are anonymous and respectful. Emergency situations should contact local services directly.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}