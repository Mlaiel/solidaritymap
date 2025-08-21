/*
 * Owner: Fahed Mlaiel
 * Contact: mlaiel@live.de
 * Notice: Attribution to Fahed Mlaiel is mandatory in all copies, forks, and derivatives.
 */

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Heart,
  MapPin,
  Star,
  Shield,
  Search,
  Filter,
  Users,
  Clock,
  Award,
  TrendUp
} from '@phosphor-icons/react'
import { VolunteerProfile } from '@/lib/types'

interface VolunteerDirectoryProps {
  volunteers: VolunteerProfile[]
  onViewProfile: (volunteerId: string) => void
}

export function VolunteerDirectory({ volunteers, onViewProfile }: VolunteerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'cases' | 'hours' | 'recent'>('rating')
  const [filterCategory, setFilterCategory] = useState<'all' | 'homeless' | 'animal'>('all')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

  // Filter and sort volunteers
  const filteredAndSortedVolunteers = useMemo(() => {
    let filtered = volunteers.filter(volunteer => {
      // Text search
      const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           volunteer.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           volunteer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Category filter
      const matchesCategory = filterCategory === 'all' || 
                             volunteer.preferences.preferredCategories.includes(filterCategory as any)
      
      // Verification filter
      const matchesVerification = !showVerifiedOnly || volunteer.verification.isVerified

      return matchesSearch && matchesCategory && matchesVerification
    })

    // Sort volunteers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.stats.rating - a.stats.rating
        case 'cases':
          return b.stats.totalCasesHelped - a.stats.totalCasesHelped
        case 'hours':
          return b.stats.totalHoursVolunteered - a.stats.totalHoursVolunteered
        case 'recent':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [volunteers, searchQuery, sortBy, filterCategory, showVerifiedOnly])

  const formatDuration = (hours: number) => {
    if (hours < 1) return '<1h'
    return hours >= 100 ? `${Math.floor(hours)}h` : `${hours.toFixed(1)}h`
  }

  const getTopBadge = (volunteer: VolunteerProfile) => {
    if (volunteer.stats.badges.length === 0) return null
    return volunteer.stats.badges.reduce((top, badge) => 
      new Date(badge.earnedAt) > new Date(top.earnedAt) ? badge : top
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Volunteer Community</h2>
          <p className="text-muted-foreground">
            Connect with {volunteers.length} dedicated volunteers in your area
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} />
          <span>{filteredAndSortedVolunteers.length} volunteers</span>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search volunteers by name, skills, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="cases">Cases Helped</SelectItem>
                  <SelectItem value="hours">Hours Volunteered</SelectItem>
                  <SelectItem value="recent">Recently Joined</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="homeless">Homeless</SelectItem>
                  <SelectItem value="animal">Animals</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showVerifiedOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                className="flex items-center gap-2"
              >
                <Shield size={16} />
                Verified Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedVolunteers.map((volunteer) => {
          const topBadge = getTopBadge(volunteer)
          
          return (
            <Card key={volunteer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
                    <AvatarFallback>
                      {volunteer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{volunteer.name}</h3>
                      {volunteer.verification.isVerified && (
                        <Shield className="text-primary flex-shrink-0" size={16} />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            weight={star <= volunteer.stats.rating ? 'fill' : 'regular'}
                            className={star <= volunteer.stats.rating ? 'text-yellow-500' : 'text-muted-foreground'}
                            size={12}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({volunteer.stats.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio */}
                {volunteer.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {volunteer.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-semibold text-primary">{volunteer.stats.totalCasesHelped}</div>
                    <div className="text-xs text-muted-foreground">Cases</div>
                  </div>
                  <div>
                    <div className="font-semibold text-accent">{formatDuration(volunteer.stats.totalHoursVolunteered)}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div>
                    <div className="font-semibold text-success">{volunteer.stats.activeStreakDays}</div>
                    <div className="text-xs text-muted-foreground">Streak</div>
                  </div>
                </div>

                {/* Skills */}
                {volunteer.skills.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {volunteer.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{volunteer.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Specializes in</div>
                  <div className="flex gap-1">
                    {volunteer.preferences.preferredCategories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs capitalize">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Top Badge */}
                {topBadge && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <span className="text-sm">{topBadge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{topBadge.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{topBadge.description}</div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  onClick={() => onViewProfile(volunteer.id)}
                  className="w-full"
                  size="sm"
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedVolunteers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters to find volunteers.
          </p>
        </div>
      )}

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendUp className="text-primary" />
            Community Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {volunteers.reduce((sum, v) => sum + v.stats.totalCasesHelped, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Cases Helped</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-accent">
                {Math.round(volunteers.reduce((sum, v) => sum + v.stats.totalHoursVolunteered, 0))}h
              </div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-success">
                {volunteers.filter(v => v.verification.isVerified).length}
              </div>
              <div className="text-sm text-muted-foreground">Verified Volunteers</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold">
                {(volunteers.reduce((sum, v) => sum + v.stats.rating, 0) / volunteers.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}