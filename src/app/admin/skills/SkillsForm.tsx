
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateSkills } from '@/actions/skills';
import type { Skill } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required."),
  category: z.enum(["Technical", "Tools"]),
});

const skillsFormSchema = z.object({
  skills: z.array(skillSchema),
});

type SkillsFormValues = z.infer<typeof skillsFormSchema>;

export function SkillsForm({ initialSkills }: { initialSkills: Skill[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: { skills: initialSkills || [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const onSubmit = async (data: SkillsFormValues) => {
    setIsSubmitting(true);

    console.log("Attempting to save skills. Current user:", user);
    if (!user) {
      console.error("No user authenticated. Aborting save.");
      toast({
        title: 'Authentication Error',
        description: "You are not logged in. Please log in and try again.",
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const skillsRef = doc(firestore, "skills", "main");
      await setDoc(skillsRef, { skills: data.skills });

      const result = await updateSkills(data);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        form.reset(data);
      } else {
        toast({
          title: 'Error during revalidation',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
        console.error("Error updating skills:", error);
        toast({
            title: 'Error',
            description: error.message || "Failed to save skills. Please check permissions and try again.",
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Manage Skills</CardTitle>
            <CardDescription>Add, edit, or remove your skills.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg relative">
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  aria-label={`Remove skill ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Skill Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. React" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`skills.${index}.category`}
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormLabel>Category</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                         </FormControl>
                        <SelectContent>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Tools">Tools</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
             <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: '', category: 'Technical' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
