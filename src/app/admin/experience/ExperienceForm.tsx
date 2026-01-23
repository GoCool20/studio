'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateExperienceAction } from '@/actions/experience';
import type { Experience } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

const experienceEntrySchema = z.object({
  id: z.string(),
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  description: z.string().min(1, 'Description is required.'),
});

const experienceFormSchema = z.object({
  entries: z.array(experienceEntrySchema),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

type ExperienceFormProps = {
  initialData: Experience[];
};

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, firestore } = useAuth();

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      entries: initialData || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsSubmitting(true);

    if (!user) {
      toast({
        title: 'Authentication Error',
        description: "You are not logged in. Please log in and try again.",
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const experienceRef = doc(firestore, "experience", "main");
      await setDoc(experienceRef, { entries: data.entries });
      
      const result = await updateExperienceAction(data);

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
      console.error("Error updating experience:", error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save experience details. Please check your permissions and try again.',
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
            <CardTitle>Manage Experience</CardTitle>
            <CardDescription>Add, edit, or remove your work experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-4 space-y-4 relative bg-card">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  aria-label={`Remove entry ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`entries.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`entries.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Google" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`entries.${index}.duration`}
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                          <Input placeholder="e.g., 2022 - Present" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.description`}
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                          <Textarea placeholder="Describe your responsibilities and achievements." {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ id: crypto.randomUUID(), role: '', company: '', duration: '', description: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Experience Entry
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
