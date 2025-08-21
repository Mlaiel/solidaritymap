/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { CaseReport } from './types';

export const sampleCases: CaseReport[] = [
  {
    id: 'case-sample-1',
    type: 'homeless',
    location: { lat: 40.7128, lng: -74.0060 }, // NYC approximate
    description: 'Person needs warm blanket and food. Sitting near subway entrance, appears to have been there for several hours.',
    urgency: 'high',
    status: 'open',
    reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    tags: ['food', 'blanket', 'shelter']
  },
  {
    id: 'case-sample-2',
    type: 'animal',
    location: { lat: 40.7589, lng: -73.9851 }, // Central Park area
    description: 'Injured dog with what appears to be a limp. Friendly but seems scared. Needs veterinary attention.',
    urgency: 'medium',
    status: 'in-progress',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    tags: ['veterinary', 'injured', 'rescue']
  },
  {
    id: 'case-sample-3',
    type: 'homeless',
    location: { lat: 40.7505, lng: -73.9934 }, // Times Square area
    description: 'Elderly person needs assistance finding shelter for the night. Has medication but no place to store it safely.',
    urgency: 'medium',
    status: 'helped',
    reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    helpedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    helpedBy: 'Local Volunteer',
    tags: ['shelter', 'elderly', 'medication']
  },
  {
    id: 'case-sample-4',
    type: 'animal',
    location: { lat: 40.7282, lng: -73.7949 }, // Queens area
    description: 'Group of kittens found in abandoned building. Need food, water, and rescue. Mother cat not present.',
    urgency: 'high',
    status: 'open',
    reportedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    tags: ['kittens', 'rescue', 'abandoned', 'food']
  },
  {
    id: 'case-sample-5',
    type: 'homeless',
    location: { lat: 40.6782, lng: -73.9442 }, // Brooklyn area
    description: 'Young person with backpack needs information about local youth services and a meal.',
    urgency: 'low',
    status: 'open',
    reportedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    tags: ['youth', 'information', 'food', 'services']
  }
];

// Function to add sample data for testing (dev only)
export function addSampleData(setCases: (cases: CaseReport[]) => void): void {
  if (process.env.NODE_ENV === 'development') {
    setCases(sampleCases);
  }
}