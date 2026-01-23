
'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateEducationAction } from '@/actions/education';
import type { Education } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

const educationEntrySchema = z.object({
  id: z.string(),
  degree: z.string().min(1, 'Degree is required.'),
  institution: z.string().min(1, 'Institution is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  score: z.string().min(1, 'Score/CGPA is required.'),
});

const educationFormSchema = z.object({
  entries: z.array(educationEntrySchema),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

type EducationFormProps = {
  initialData: Education[];
};

export function EducationForm({ initialData }: EducationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      entries: initialData || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const onSubmit = async (data: EducationFormValues) => {
    setIsSubmitting(true);

    console.log("Attempting to save education details. Current user:", user);
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
      const educationRef = doc(firestore, "education", "main");
      await setDoc(educationRef, { entries: data.entries });
      
      const result = await updateEducationAction(data);

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
      console.error("Error updating education:", error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save education details. Please check your permissions and try again.',
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
            <CardTitle>Manage Education</CardTitle>
            <CardDescription>Add, edit, or remove your educational qualifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-4 space-y-4 relative">
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
                    name={`entries.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bachelor of Technology" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`entries.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., University of Example" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name={`entries.${index}.duration`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 2018 - 2022" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`entries.${index}.score`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Score / CGPA</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 8.5 CGPA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ id: crypto.randomUUID(), degree: '', institution: '', duration: '', score: '' })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Education Entry
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
