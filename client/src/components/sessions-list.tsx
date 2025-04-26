import { Session } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, UserCircle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function SessionsList({ sessions }: { sessions: Session[] }) {
  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const bookSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/sessions/${session.id}/book`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/learning"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Session booked!",
        description: "You've successfully booked this session",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/sessions/${session.id}/complete`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/teaching"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/learning"] });
      toast({
        title: "Session completed!",
        description: "You've marked this session as completed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Completion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const formattedDate = session.dateTime ? format(new Date(session.dateTime), "PPP") : "Date not set";
  const formattedTime = session.dateTime ? format(new Date(session.dateTime), "p") : "Time not set";
  const isTeacher = user?.id === session.teacherId;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{session.title}</h3>
              <p className="text-muted-foreground text-sm">{session.description}</p>
            </div>
            <SessionStatusBadge status={session.status} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formattedTime} ({session.duration} min)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{session.location || "Online"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <span>{isTeacher ? "You're teaching" : "You're learning"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">{session.creditCost} credit{session.creditCost !== 1 ? 's' : ''}</Badge>
            
            {session.meetingLink && (
              <Badge variant="secondary">
                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                  Meeting link
                </a>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 px-6 py-3">
        {session.status === "open" && !isTeacher && (
          <Button 
            onClick={() => bookSessionMutation.mutate()}
            disabled={bookSessionMutation.isPending}
          >
            Book Session
          </Button>
        )}
        
        {session.status === "booked" && isTeacher && (
          <Button 
            onClick={() => completeSessionMutation.mutate()}
            disabled={completeSessionMutation.isPending}
          >
            Mark as Completed
          </Button>
        )}
        
        {((session.status !== "open" && !isTeacher) || 
          (session.status === "open" && isTeacher) ||
          session.status === "completed") && (
          <p className="text-sm text-muted-foreground">
            {getSessionFooterText(session, isTeacher)}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

function SessionStatusBadge({ status }: { status: string }) {
  let variant: "default" | "outline" | "secondary" | "destructive" = "outline";
  
  switch (status) {
    case "open":
      variant = "secondary";
      break;
    case "booked":
      variant = "default";
      break;
    case "completed":
      variant = "outline";
      break;
    case "cancelled":
      variant = "destructive";
      break;
  }
  
  return (
    <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function getSessionFooterText(session: Session, isTeacher: boolean): string {
  switch (session.status) {
    case "open":
      return isTeacher ? "Waiting for someone to book this session" : "";
    case "booked":
      return isTeacher ? "" : "You've booked this session";
    case "completed":
      return "This session has been completed";
    case "cancelled":
      return "This session was cancelled";
    default:
      return "";
  }
}