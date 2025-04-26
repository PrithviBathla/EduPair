import { Skill, SKILL_CATEGORIES } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Code, Dumbbell, Music, Palette, 
  GraduationCap, Globe, 
} from "lucide-react";

export default function SkillsList({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground mb-4">No skills found</p>
        <p className="text-sm text-muted-foreground max-w-md">
          Add skills to your profile to start teaching or learning
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <CategoryIcon category={skill.category} />
            {skill.name}
          </CardTitle>
          <Badge variant={skill.isTeaching ? "default" : "secondary"}>
            {skill.isTeaching ? "Teaching" : "Learning"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{skill.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <Badge variant="outline">
            {skill.skillLevel.charAt(0).toUpperCase() + skill.skillLevel.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const baseClass = `h-4 w-4 ${className || ""}`;
  
  switch (category) {
    case "technology":
      return <Code className={baseClass} />;
    case "language":
      return <Globe className={baseClass} />;
    case "music":
      return <Music className={baseClass} />;
    case "art":
      return <Palette className={baseClass} />;
    case "fitness":
      return <Dumbbell className={baseClass} />;
    case "academic":
      return <GraduationCap className={baseClass} />;
    default:
      return <BookOpen className={baseClass} />;
  }
}