/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

export interface Location {
  lat: number;
  lng: number;
}

export interface CaseReport {
  id: string;
  type: 'homeless' | 'animal';
  location: Location;
  address?: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'helped' | 'closed';
  photo?: string;
  reportedAt: string;
  helpedAt?: string;
  helpedBy?: string;
  tags: string[];
}

export interface Volunteer {
  id: string;
  name?: string;
  notificationRadius: number; // in kilometers
  availableCategories: ('homeless' | 'animal')[];
  isAvailable: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  radius: number;
  categories: ('homeless' | 'animal')[];
  urgencyLevels: ('low' | 'medium' | 'high')[];
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface UserProfile {
  id: string;
  volunteer: Volunteer;
  notifications: NotificationPreferences;
  language: string;
  accessibilitySettings: {
    screenReader: boolean;
    voiceInput: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

export interface VolunteerActivity {
  id: string;
  volunteerId: string;
  caseId: string;
  action: 'helped' | 'started-helping' | 'reported' | 'updated';
  timestamp: string;
  location?: Location;
  notes?: string;
}

export interface ImpactStats {
  totalCasesHelped: number;
  totalReports: number;
  peopleHelped: number;
  animalsHelped: number;
  activeStreak: number; // consecutive days with activity
  averageResponseTime: number; // in minutes
  mostActiveCategory: 'homeless' | 'animal' | null;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface CommunityStats {
  totalVolunteers: number;
  activeCases: number;
  casesResolvedToday: number;
  casesResolvedThisWeek: number;
  casesResolvedThisMonth: number;
  averageResolutionTime: number;
  topVolunteers: Array<{
    id: string;
    name: string;
    casesHelped: number;
  }>;
}