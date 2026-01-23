
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from '@/actions/profile';
import type { Profile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email address"),
  resumeUrl: z.any().optional(),
  avatarUrl: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, firestore } = useAuth();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      title: profile?.title || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      email: profile?.email || '',
      resumeUrl: undefined,
      avatarUrl: undefined,
    },
  });

  const resumeRef = form.register("resumeUrl");
  const avatarRef = form.register("avatarUrl");

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    console.log("Submission started. User:", user ? user.uid : "No user");
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: "You must be logged in to update your profile.",
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let resumeUrl = profile.resumeUrl;
      if (data.resumeUrl && data.resumeUrl.length > 0) {
        const file = data.resumeUrl[0] as File;
        const storageRef = ref(storage, `resumes/${user.uid}_${file.name}`);
        try {
            console.log("Attempting to upload resume...");
            await uploadBytes(storageRef, file);
            console.log("Resume upload successful. Getting download URL...");
            resumeUrl = await getDownloadURL(storageRef);
            console.log("Resume download URL obtained:", resumeUrl);
        } catch (uploadError) {
            console.error("Firebase Storage upload error (resume):", uploadError);
            throw new Error("Failed to upload resume. Please check storage permissions in your Firebase project.");
        }
      }

      let avatarUrl = profile.avatarUrl;
      if (data.avatarUrl && data.avatarUrl.length > 0) {
        const file = data.avatarUrl[0] as File;
        const storageRef = ref(storage, `avatars/${user.uid}_${file.name}`);
        try {
            console.log("Attempting to upload avatar...");
            await uploadBytes(storageRef, file);
            console.log("Avatar upload successful. Getting download URL...");
            avatarUrl = await getDownloadURL(storageRef);
            console.log("Avatar download URL obtained:", avatarUrl);
        } catch (uploadError) {
            console.error("Firebase Storage upload error (avatar):", uploadError);
            throw new Error("Failed to upload avatar. Please check storage permissions in your Firebase project.");
        }
      }

      const dataToSave = {
        name: data.name,
        title: data.title,
        bio: data.bio,
        location: data.location,
        email: data.email,
        resumeUrl,
        avatarUrl,
      };

      console.log("Attempting to save profile data to Firestore...");
      const profileRef = doc(firestore, "profile", "main");
      await setDoc(profileRef, dataToSave, { merge: true });
      console.log("Profile data saved to Firestore successfully.");
      
      console.log("Revalidating paths via server action...");
      const result = await updateProfile(dataToSave);
      console.log("Revalidation result:", result);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
      } else {
        toast({
          title: 'Error during revalidation',
          description: result.message || 'An error occurred.',
          variant: 'destructive',
        });
      }
    } catch(error: any) {
      console.error("Error in onSubmit profile form:", error);
      toast({
        title: 'Error',
        description: error.message || "An unexpected error occurred. Please check the console for details.",
        variant: 'destructive',
      });
    } finally {
      console.log("Finished submission process.");
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your public profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short bio about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="resumeUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      {...resumeRef}
                    />
                  </FormControl>
                   {profile.resumeUrl && (
                    <FormDescription>
                      Current: <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="avatarUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                   <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      {...avatarRef}
                    />
                  </FormControl>
                  {profile.avatarUrl && (
                    <FormDescription>
                      <a href={profile.avatarUrl} target="_blank" rel="noopener noreferrer" className="underline">View Current Avatar</a>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
