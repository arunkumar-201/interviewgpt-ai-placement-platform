import { motion } from 'framer-motion';
import { GraduationCap, Mail, Target } from 'lucide-react';
import type { DashboardProfile } from '@interviewgpt/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  profile: DashboardProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={profile.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-lg text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <Badge variant="secondary">{profile.role}</Badge>
              </div>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center justify-center gap-2 sm:justify-start">
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email}
                </span>
                {profile.college && (
                  <span className="flex items-center justify-center gap-2 sm:justify-start">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {profile.college}
                    {profile.graduationYear && ` · ${profile.graduationYear}`}
                  </span>
                )}
                <span className="flex items-center justify-center gap-2 sm:justify-start">
                  <Target className="h-3.5 w-3.5" />
                  Target: {profile.targetRole ?? 'SDE-1'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
