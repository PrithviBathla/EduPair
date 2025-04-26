import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't
          exist.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}