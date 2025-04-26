import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SKILL_CATEGORIES, SKILL_LEVELS, insertSkillSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

// Extended schema with validation
const createSkillSchema = insertSkillSchema.extend({
  name: z.string().min(3, "Skill name must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  category: z.enum(SKILL_CATEGORIES),
  skillLevel: z.enum(SKILL_LEVELS),
  isTeaching: z.boolean(),
});

type CreateSkillFormValues = z.infer<typeof createSkillSchema>;

export default function CreateSkillForm({ onComplete }: { onComplete?: () => void }) {
  const { toast } = useToast();
  const [isTeaching, setIsTeaching] = useState(true);
  
  const form = useForm<CreateSkillFormValues>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "technology",
      skillLevel: "intermediate",
      isTeaching: true,
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (data: CreateSkillFormValues) => {
      const res = await apiRequest("POST", "/api/skills", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills/teaching"] });
      queryClient.invalidateQueries({ queryKey: ["/api/skills/learning"] });
      toast({
        title: "Skill created",
        description: `Your ${isTeaching ? "teaching" : "learning"} skill has been added.`,
      });
      form.reset();
      if (onComplete) onComplete();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create skill",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateSkillFormValues) => {
    createSkillMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="isTeaching"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {field.value ? "Teaching Skill" : "Learning Skill"}
                </FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setIsTeaching(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the skill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skillLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SKILL_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={isTeaching 
                    ? "Describe what you can teach and your experience with this skill" 
                    : "Describe what you want to learn and your current knowledge level"
                  } 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={createSkillMutation.isPending}
        >
          {createSkillMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Skill...
            </>
          ) : (
            `Add ${isTeaching ? "Teaching" : "Learning"} Skill`
          )}
        </Button>
      </form>
    </Form>
  );
}