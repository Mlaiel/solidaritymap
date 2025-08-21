/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MapPin, Heart, Paw, Clock, User, CheckCircle, AlertCircle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { CaseReport, Location } from '@/lib/types';
import { formatTimeAgo, formatDistance, calculateDistance, useGeolocation } from '@/lib/geolocation';
import { useKV } from '@github/spark/hooks';

interface CaseListProps {
  cases: CaseReport[];
  onCaseUpdate: (updatedCase: CaseReport) => void;
}

export function CaseList({ cases, onCaseUpdate }: CaseListProps) {
  const [filter, setFilter] = useState<'all' | 'homeless' | 'animal'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'helped'>('all');
  const [selectedCase, setSelectedCase] = useState<CaseReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [storedCases, setStoredCases] = useKV<CaseReport[]>('solidarity-cases', []);
  
  const { location } = useGeolocation();

  // Filter cases based on selected filters
  const filteredCases = cases.filter(case_ => {
    const typeMatch = filter === 'all' || case_.type === filter;
    const statusMatch = statusFilter === 'all' || case_.status === statusFilter;
    return typeMatch && statusMatch;
  });

  // Sort cases by urgency and time
  const sortedCases = [...filteredCases].sort((a, b) => {
    // First by urgency (high -> medium -> low)
    const urgencyOrder = { high: 3, medium: 2, low: 1 };
    const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // Then by time (newest first)
    return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
  });

  const handleStatusUpdate = async (caseReport: CaseReport, newStatus: 'in-progress' | 'helped') => {
    const updatedCase: CaseReport = {
      ...caseReport,
      status: newStatus,
      helpedAt: newStatus === 'helped' ? new Date().toISOString() : caseReport.helpedAt,
      helpedBy: newStatus === 'helped' ? 'Anonymous Volunteer' : caseReport.helpedBy
    };

    // Update in persistent storage
    setStoredCases((currentCases) => 
      currentCases.map(c => c.id === caseReport.id ? updatedCase : c)
    );
    
    onCaseUpdate(updatedCase);
    setIsDialogOpen(false);
    
    toast.success(
      newStatus === 'helped' 
        ? 'Marked as helped! Thank you for making a difference.' 
        : 'Marked as in progress. Let the community know you\'re on it!'
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in-progress': return 'default';
      case 'helped': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in-progress': return Clock;
      case 'helped': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const CaseCard = ({ case_: caseReport }: { case_: CaseReport }) => {
    const distance = location ? calculateDistance(location, caseReport.location) : null;
    const StatusIcon = getStatusIcon(caseReport.status);

    return (
      <Dialog open={isDialogOpen && selectedCase?.id === caseReport.id} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
            style={{
              borderLeftColor: caseReport.urgency === 'high' ? 'hsl(var(--destructive))' : 
                               caseReport.urgency === 'medium' ? 'hsl(var(--primary))' : 
                               'hsl(var(--muted-foreground))'
            }}
            onClick={() => {
              setSelectedCase(caseReport);
              setIsDialogOpen(true);
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {caseReport.type === 'homeless' ? (
                    <Heart className="text-primary" size={18} />
                  ) : (
                    <Paw className="text-primary" size={18} />
                  )}
                  {caseReport.type === 'homeless' ? 'Person needs help' : 'Animal needs help'}
                </CardTitle>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={getUrgencyColor(caseReport.urgency) as any} className="text-xs">
                    {caseReport.urgency}
                  </Badge>
                  <Badge variant={getStatusColor(caseReport.status) as any} className="flex items-center gap-1 text-xs">
                    <StatusIcon size={12} />
                    {caseReport.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {caseReport.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  {distance ? formatDistance(distance) : 'Location'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimeAgo(caseReport.reportedAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Case Detail Dialog */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {caseReport.type === 'homeless' ? (
                <Heart className="text-primary" weight="fill" />
              ) : (
                <Paw className="text-primary" weight="fill" />
              )}
              {caseReport.type === 'homeless' ? 'Person Needs Help' : 'Animal Needs Help'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status and Urgency */}
            <div className="flex gap-2">
              <Badge variant={getUrgencyColor(caseReport.urgency) as any}>
                {caseReport.urgency} urgency
              </Badge>
              <Badge variant={getStatusColor(caseReport.status) as any} className="flex items-center gap-1">
                <StatusIcon size={12} />
                {caseReport.status.replace('-', ' ')}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Situation</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                {caseReport.description}
              </p>
            </div>

            {/* Location and Time */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <MapPin size={14} />
                  Distance
                </div>
                <div className="font-medium">
                  {distance ? formatDistance(distance) : 'Unknown'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Clock size={14} />
                  Reported
                </div>
                <div className="font-medium">
                  {formatTimeAgo(caseReport.reportedAt)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {caseReport.status === 'open' && (
              <div className="space-y-2">
                <Separator />
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleStatusUpdate(caseReport, 'in-progress')}
                    className="w-full"
                    variant="default"
                  >
                    <User className="mr-2" size={16} />
                    I'm going to help
                  </Button>
                  <Button 
                    onClick={() => handleStatusUpdate(caseReport, 'helped')}
                    className="w-full"
                    variant="outline"
                  >
                    <CheckCircle className="mr-2" size={16} />
                    Mark as helped
                  </Button>
                </div>
              </div>
            )}

            {caseReport.status === 'in-progress' && (
              <div className="space-y-2">
                <Separator />
                <Button 
                  onClick={() => handleStatusUpdate(caseReport, 'helped')}
                  className="w-full"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Mark as helped
                </Button>
              </div>
            )}

            {caseReport.status === 'helped' && caseReport.helpedAt && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="font-medium">Help provided</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Helped {formatTimeAgo(caseReport.helpedAt)}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select value={filter} onValueChange={(value: 'all' | 'homeless' | 'animal') => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cases</SelectItem>
              <SelectItem value="homeless">People</SelectItem>
              <SelectItem value="animal">Animals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={statusFilter} onValueChange={(value: 'all' | 'open' | 'in-progress' | 'helped') => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="helped">Helped</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cases Grid */}
      {sortedCases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="text-muted-foreground mb-4" size={48} />
            <h3 className="font-medium text-lg mb-2">No cases found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {filter === 'all' 
                ? "There are currently no assistance requests in your area." 
                : `No ${filter === 'homeless' ? 'people' : 'animals'} need help right now.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedCases.map((caseReport) => (
            <CaseCard key={caseReport.id} case_={caseReport} />
          ))}
        </div>
      )}
    </div>
  );
}