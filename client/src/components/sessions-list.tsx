import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { formatDistance } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function SessionsList({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground mb-4">No sessions found</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Sessions will appear here once they are created or booked
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const isTeacher = user?.id === session.teacherId;
  
  const bookSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "PATCH", 
        `/api/sessions/${session.id}/book`,
        { status: "booked" }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/available"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/learning"] });
      toast({
        title: "Session booked",
        description: "You have successfully booked this session",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to book session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "PATCH", 
        `/api/sessions/${session.id}/cancel`,
        { status: "cancelled" }
      );
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      if (isTeacher) {
        queryClient.invalidateQueries({ queryKey: ["/api/sessions/teaching"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/sessions/learning"] });
      }
      toast({
        title: "Session cancelled",
        description: "The session has been cancelled",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "PATCH", 
        `/api/sessions/${session.id}/complete`,
        { status: "completed" }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/teaching"] });
      toast({
        title: "Session completed",
        description: "The session has been marked as completed",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to complete session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isPending = 
    bookSessionMutation.isPending || 
    cancelSessionMutation.isPending || 
    completeSessionMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <SessionStatusBadge status={session.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{session.description}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistance(new Date(session.dateTime), new Date(), { addSuffix: true })}
          </p>
          <p className="text-sm font-medium">
            {session.creditCost} credit{session.creditCost !== 1 ? "s" : ""}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <p className="text-xs text-muted-foreground mb-2">
            {getSessionFooterText(session, isTeacher)}
          </p>
          
          {session.status === "open" && !isTeacher && (
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => bookSessionMutation.mutate()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Book Session
            </Button>
          )}
          
          {session.status === "booked" && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => cancelSessionMutation.mutate()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cancel Session
            </Button>
          )}
          
          {session.status === "booked" && isTeacher && (
            <Button 
              variant="default" 
              className="w-full mt-2" 
              onClick={() => completeSessionMutation.mutate()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Complete Session
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function SessionStatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  
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
  if (isTeacher) {
    switch (session.status) {
      case "open":
        return "Waiting for a student to book this session";
      case "booked":
        return "Session booked. Complete after teaching.";
      case "completed":
        return "Session completed. Thanks for teaching!";
      case "cancelled":
        return "This session was cancelled";
      default:
        return "";
    }
  } else {
    switch (session.status) {
      case "open":
        return "Book this session to learn this skill";
      case "booked":
        return "You booked this session";
      case "completed":
        return "You completed this learning session";
      case "cancelled":
        return "This session was cancelled";
      default:
        return "";
    }
  }
}