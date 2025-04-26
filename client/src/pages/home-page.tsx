import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Session, Skill } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import SkillsList from "@/components/skills-list";
import SessionsList from "@/components/sessions-list";
import CreateSkillForm from "@/components/create-skill-form";
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Plus, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [createSkillOpen, setCreateSkillOpen] = useState(false);
  
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl font-bold">EduPair</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <GraduationCap className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Sessions
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Users className="mr-2 h-4 w-4" />
            Community
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <div className="mt-auto pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-muted-foreground">{user.credits} credits</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            size="sm"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-background z-10">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              Credits: {user.credits}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Create New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setCreateSkillOpen(true)}>
                  Add Skill
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Create Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="p-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
            <StatsCard 
              title="Teaching Skills" 
              value={<TeachingSkillsCount userId={user.id} />}
              description="Skills you're offering to teach"
              icon={<GraduationCap className="h-5 w-5" />}
            />
            <StatsCard 
              title="Learning Skills" 
              value={<LearningSkillsCount userId={user.id} />}
              description="Skills you want to learn"
              icon={<BookOpen className="h-5 w-5" />}
            />
            <StatsCard 
              title="Total Sessions" 
              value={<SessionsCount userId={user.id} />}
              description="Sessions taught or attended"
              icon={<Calendar className="h-5 w-5" />}
            />
          </div>
          
          <Tabs defaultValue="skills" className="space-y-6">
            <TabsList>
              <TabsTrigger value="skills">My Skills</TabsTrigger>
              <TabsTrigger value="sessions">My Sessions</TabsTrigger>
              <TabsTrigger value="available">Available Sessions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-6">
              <div className="flex flex-col space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Skills</CardTitle>
                    <CardDescription>
                      Skills you're offering to teach others
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TeachingSkills userId={user.id} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Skills</CardTitle>
                    <CardDescription>
                      Skills you want to learn from others
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LearningSkills userId={user.id} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="sessions" className="space-y-6">
              <div className="flex flex-col space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>
                      Your scheduled teaching and learning sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingSessions userId={user.id} />
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Teaching Sessions</CardTitle>
                      <CardDescription>
                        Sessions where you're the teacher
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TeachingSessions userId={user.id} />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Sessions</CardTitle>
                      <CardDescription>
                        Sessions where you're the student
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LearningSessions userId={user.id} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="available">
              <Card>
                <CardHeader>
                  <CardTitle>Available Sessions</CardTitle>
                  <CardDescription>
                    Browse sessions that you can book using your credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AvailableSessions />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Dialogs */}
      <Dialog open={createSkillOpen} onOpenChange={setCreateSkillOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a New Skill</DialogTitle>
            <DialogDescription>
              Add a skill you can teach or want to learn from others
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <CreateSkillForm onComplete={() => setCreateSkillOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
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
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TeachingSkillsCount({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills/teaching"],
  });
  
  if (isLoading) return <span>...</span>;
  return <>{data?.length || 0}</>;
}

function LearningSkillsCount({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills/learning"],
  });
  
  if (isLoading) return <span>...</span>;
  return <>{data?.length || 0}</>;
}

function SessionsCount({ userId }: { userId: number }) {
  const teachingQuery = useQuery<Session[]>({
    queryKey: ["/api/sessions/teaching"],
  });
  
  const learningQuery = useQuery<Session[]>({
    queryKey: ["/api/sessions/learning"],
  });
  
  if (teachingQuery.isLoading || learningQuery.isLoading) return <span>...</span>;
  
  const teachingCount = teachingQuery.data?.length || 0;
  const learningCount = learningQuery.data?.length || 0;
  
  return <>{teachingCount + learningCount}</>;
}

function TeachingSkills({ userId, limit }: { userId: number, limit?: number }) {
  const { data, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills/teaching"],
  });
  
  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading...</div>;
  }
  
  const skills = limit ? data?.slice(0, limit) : data;
  
  return <SkillsList skills={skills || []} />;
}

function LearningSkills({ userId, limit }: { userId: number, limit?: number }) {
  const { data, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills/learning"],
  });
  
  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading...</div>;
  }
  
  const skills = limit ? data?.slice(0, limit) : data;
  
  return <SkillsList skills={skills || []} />;
}

function TeachingSessions({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions/teaching"],
  });
  
  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading...</div>;
  }
  
  return <SessionsList sessions={data || []} />;
}

function LearningSessions({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions/learning"],
  });
  
  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading...</div>;
  }
  
  return <SessionsList sessions={data || []} />;
}

function UpcomingSessions({ userId }: { userId: number }) {
  const teachingQuery = useQuery<Session[]>({
    queryKey: ["/api/sessions/teaching"],
  });
  
  const learningQuery = useQuery<Session[]>({
    queryKey: ["/api/sessions/learning"],
  });
  
  if (teachingQuery.isLoading || learningQuery.isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading...</div>;
  }
  
  const teachingSessions = teachingQuery.data || [];
  const learningSessions = learningQuery.data || [];
  
  const upcomingSessions = [...teachingSessions, ...learningSessions]
    .filter(session => session.status === "booked")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3);
  
  return <SessionsList sessions={upcomingSessions} />;
}

function AvailableSessions() {
  const { data, isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions/available"],
  });
  
  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading...</div>;
  }
  
  return <SessionsList sessions={data || []} />;
}