
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidateAndRedirectProjects } from '@/actions/projects';
import { useAuth } from '@/hooks/useAuth';
import { storage } from "@/lib/firebase";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  detailedDescription: z.string().min(1, "Detailed description is required"),
  techStack: z.preprocess((val) => {
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return val;
    }, z.array(z.string()).min(1, "At least one tech stack item is required")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
  liveDemoUrl: z.string().url("Invalid live demo URL").optional().or(z.literal('')),
  imageUrl: z.any().optional(),
  featured: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  initialData?: Project | null;
};

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, firestore } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || '',
      shortDescription: initialData?.shortDescription || '',
      detailedDescription: initialData?.detailedDescription || '',
      techStack: initialData?.techStack?.join(', ') || '',
      githubUrl: initialData?.githubUrl || '',
      liveDemoUrl: initialData?.liveDemoUrl || '',
      imageUrl: undefined,
      featured: initialData?.featured || false,
    },
  });
  
  const imageRef = form.register("imageUrl");

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    console.log("Submission started. User:", user ? user.uid : "No user");

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
      let imageUrl = initialData?.imageUrl || '';
      if (data.imageUrl && data.imageUrl.length > 0) {
        const file = data.imageUrl[0] as File;
        const storageRef = ref(storage, `projects/${user.uid}_${file.name}`);
        try {
            console.log("Attempting to upload project image...");
            await uploadBytes(storageRef, file);
            console.log("Project image upload successful. Getting download URL...");
            imageUrl = await getDownloadURL(storageRef);
            console.log("Project image download URL obtained:", imageUrl);
        } catch (uploadError) {
            console.error("Firebase Storage upload error (project image):", uploadError);
            throw new Error("Failed to upload project image. Please check storage permissions.");
        }
      }

      const dataToSave = {
        title: data.title,
        shortDescription: data.shortDescription,
        detailedDescription: data.detailedDescription,
        techStack: data.techStack,
        githubUrl: data.githubUrl,
        liveDemoUrl: data.liveDemoUrl,
        featured: data.featured,
        imageUrl,
      };

      if (initialData?.id) {
        console.log(`Updating project ${initialData.id}...`);
        const projectRef = doc(firestore, "projects", initialData.id);
        await setDoc(projectRef, dataToSave);
        console.log("Project updated successfully.");
      } else {
        console.log("Creating new project...");
        await addDoc(collection(firestore, "projects"), dataToSave);
        console.log("New project created successfully.");
      }
      
      console.log("Revalidating and redirecting...");
      await revalidateAndRedirectProjects();

    } catch (error: any) {
      console.error("Error saving project:", error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save project. Please check the console for details.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? 'Edit Project' : 'Create New Project'}</CardTitle>
            <CardDescription>
              {initialData ? 'Update the details of your project.' : 'Fill in the details to add a new project.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control} name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="detailedDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/*"
                      {...imageRef}
                    />
                  </FormControl>
                  {initialData?.imageUrl && (
                    <FormDescription>
                      <a href={initialData.imageUrl} target="_blank" rel="noopener noreferrer" className="underline">View Current Image</a>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="liveDemoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Demo URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control} name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                   <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Project</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? 'Update Project' : 'Create Project'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/projects">Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
