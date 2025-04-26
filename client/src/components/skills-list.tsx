import { Skill } from "@shared/schema";
import { SKILL_CATEGORIES, SKILL_LEVELS } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Code, Palette, Briefcase, Heart, Music, Dumbbell, ChefHat, GraduationCap, HelpCircle } from "lucide-react";

export default function SkillsList({ skills }: { skills: Skill[] }) {
  if (!skills.length) {
    return <p className="text-muted-foreground">No skills found.</p>;
  }

  return (
    <div className="space-y-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">{skill.name}</CardTitle>
            <CardDescription>
              {skill.isTeaching ? "Teaching skill" : "Learning skill"}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <CategoryIcon category={skill.category} className="mr-1 h-4 w-4" />
            <Badge variant="outline">{skill.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
        <Badge variant="secondary">{skill.skillLevel}</Badge>
      </CardContent>
    </Card>
  );
}

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  switch (category) {
    case "technology":
      return <Code className={className} />;
    case "language":
      return <Book className={className} />;
    case "arts":
      return <Palette className={className} />;
    case "business":
      return <Briefcase className={className} />;
    case "health":
      return <Heart className={className} />;
    case "music":
      return <Music className={className} />;
    case "sports":
      return <Dumbbell className={className} />;
    case "cooking":
      return <ChefHat className={className} />;
    case "academic":
      return <GraduationCap className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}