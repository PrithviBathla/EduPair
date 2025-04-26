import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Session, Skill } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Calendar, Clock, MapPin, Star, Plus, BookOpen, GraduationCap } from "lucide-react";
// Import components directly instead of from modules
import SessionsList from "../components/sessions-list";
import SkillsList from "../components/skills-list";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  
  // Instead of returning null, render a loading state
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">EduPair</h1>
            <Badge variant="outline" className="ml-2">Beta</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium">{user.username}</p>
              <p className="text-muted-foreground text-sm">{user.credits} credits</p>
            </div>
            
            <Avatar>
              <AvatarImage src={user.avatar || undefined} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <Button variant="outline" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
              {logoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* User profile sidebar */}
          <aside className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{user.username}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {user.credits} credits
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {user.bio ? (
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No bio provided. Update your profile to tell others about yourself.
                  </p>
                )}
                
                <Separator className="my-4" />
                
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      <TeachingSkillsCount userId={user.id} />
                    </p>
                    <p className="text-xs text-muted-foreground">Teaching</p>
                  </div>
                  
                  <div>
                    <p className="text-2xl font-bold">
                      <LearningSkillsCount userId={user.id} />
                    </p>
                    <p className="text-xs text-muted-foreground">Learning</p>
                  </div>
                  
                  <div>
                    <p className="text-2xl font-bold">
                      <SessionsCount userId={user.id} />
                    </p>
                    <p className="text-xs text-muted-foreground">Sessions</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </aside>

          {/* Main content */}
          <div className="md:col-span-9">
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="teaching">Teaching</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard 
                    title="Available Credits" 
                    value={user.credits.toString()} 
                    description="Use credits to book sessions" 
                    icon={<Star className="h-4 w-4" />} 
                  />
                  
                  <StatsCard 
                    title="Teaching Skills" 
                    value={<TeachingSkillsCount userId={user.id} />} 
                    description="Skills you can teach" 
                    icon={<GraduationCap className="h-4 w-4" />} 
                  />
                  
                  <StatsCard 
                    title="Learning Skills" 
                    value={<LearningSkillsCount userId={user.id} />} 
                    description="Skills you want to learn" 
                    icon={<BookOpen className="h-4 w-4" />} 
                  />
                  
                  <StatsCard 
                    title="Total Sessions" 
                    value={<SessionsCount userId={user.id} />} 
                    description="Sessions taught or attended" 
                    icon={<Calendar className="h-4 w-4" />} 
                  />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Upcoming Sessions</CardTitle>
                    <CardDescription>Sessions you're teaching or attending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingSessions userId={user.id} />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Teaching Skills</CardTitle>
                        <CardDescription>Skills you can teach to others</CardDescription>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <TeachingSkills userId={user.id} limit={3} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Learning Skills</CardTitle>
                        <CardDescription>Skills you want to learn</CardDescription>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <LearningSkills userId={user.id} limit={3} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="teaching">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Teaching Skills</CardTitle>
                      <CardDescription>Skills you can offer to teach others</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" /> Add Teaching Skill
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <TeachingSkills userId={user.id} />
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Teaching Sessions</CardTitle>
                        <CardDescription>Sessions you're offering or have taught</CardDescription>
                      </div>
                      <Button>
                        <Plus className="h-4 w-4 mr-1" /> Offer New Session
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <TeachingSessions userId={user.id} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="learning">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Your Learning Skills</CardTitle>
                      <CardDescription>Skills you want to learn from others</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" /> Add Learning Skill
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <LearningSkills userId={user.id} />
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Learning Sessions</CardTitle>
                        <CardDescription>Sessions you've booked or attended</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <LearningSessions userId={user.id} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="discover">
                <Card>
                  <CardHeader>
                    <CardTitle>Discover Available Sessions</CardTitle>
                    <CardDescription>Find and book sessions from other users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvailableSessions />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatsCard({ title, value, description, icon }: { 
  title: string; 
  value: React.ReactNode; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TeachingSkillsCount({ userId }: { userId: number }) {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills/teaching"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/skills/teaching");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin mx-auto" />;
  return skills?.length || 0;
}

function LearningSkillsCount({ userId }: { userId: number }) {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills/learning"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/skills/learning");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin mx-auto" />;
  return skills?.length || 0;
}

function SessionsCount({ userId }: { userId: number }) {
  const { data: teaching, isLoading: isLoadingTeaching } = useQuery<Session[]>({
    queryKey: ["/api/sessions/teaching"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions/teaching");
      return res.json();
    },
  });
  
  const { data: learning, isLoading: isLoadingLearning } = useQuery<Session[]>({
    queryKey: ["/api/sessions/learning"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions/learning");
      return res.json();
    },
  });
  
  if (isLoadingTeaching || isLoadingLearning) return <Loader2 className="h-4 w-4 animate-spin mx-auto" />;
  return (teaching?.length || 0) + (learning?.length || 0);
}

function TeachingSkills({ userId, limit }: { userId: number, limit?: number }) {
  const { data: skills, isLoading, error } = useQuery<Skill[]>({
    queryKey: ["/api/skills/teaching"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/skills/teaching");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  if (error) return <p className="text-destructive">Error loading skills</p>;
  if (!skills?.length) return <p className="text-muted-foreground">You haven't added any teaching skills yet.</p>;
  
  const displaySkills = limit ? skills.slice(0, limit) : skills;
  
  return <SkillsList skills={displaySkills} />;
}

function LearningSkills({ userId, limit }: { userId: number, limit?: number }) {
  const { data: skills, isLoading, error } = useQuery<Skill[]>({
    queryKey: ["/api/skills/learning"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/skills/learning");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  if (error) return <p className="text-destructive">Error loading skills</p>;
  if (!skills?.length) return <p className="text-muted-foreground">You haven't added any learning skills yet.</p>;
  
  const displaySkills = limit ? skills.slice(0, limit) : skills;
  
  return <SkillsList skills={displaySkills} />;
}

function TeachingSessions({ userId }: { userId: number }) {
  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ["/api/sessions/teaching"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions/teaching");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  if (error) return <p className="text-destructive">Error loading sessions</p>;
  if (!sessions?.length) return <p className="text-muted-foreground">You haven't created any teaching sessions yet.</p>;
  
  return <SessionsList sessions={sessions} />;
}

function LearningSessions({ userId }: { userId: number }) {
  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ["/api/sessions/learning"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions/learning");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  if (error) return <p className="text-destructive">Error loading sessions</p>;
  if (!sessions?.length) return <p className="text-muted-foreground">You haven't booked any learning sessions yet.</p>;
  
  return <SessionsList sessions={sessions} />;
}

function UpcomingSessions({ userId }: { userId: number }) {
  const { data: teachingSessions, isLoading: isLoadingTeaching } = useQuery<Session[]>({
    queryKey: ["/api/sessions/teaching"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions/teaching");
      return res.json();
    },
  });
  
  const { data: learningSessions, isLoading: isLoadingLearning } = useQuery<Session[]>({
    queryKey: ["/api/sessions/learning"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions/learning");
      return res.json();
    },
  });
  
  if (isLoadingTeaching || isLoadingLearning) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  
  const teachingFiltered = teachingSessions?.filter(s => s.status === "booked") || [];
  const learningFiltered = learningSessions?.filter(s => s.status === "booked") || [];
  
  const upcomingSessions = [...teachingFiltered, ...learningFiltered]
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3);
  
  if (!upcomingSessions.length) return <p className="text-muted-foreground">You don't have any upcoming sessions.</p>;
  
  return <SessionsList sessions={upcomingSessions} />;
}

function AvailableSessions() {
  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/sessions");
      return res.json();
    },
  });
  
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
  if (error) return <p className="text-destructive">Error loading available sessions</p>;
  if (!sessions?.length) return <p className="text-muted-foreground">There are no available sessions at the moment.</p>;
  
  return <SessionsList sessions={sessions} />;
}