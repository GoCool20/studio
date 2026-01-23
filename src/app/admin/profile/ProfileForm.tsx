
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from '@/actions/profile';
import type { Profile, SocialLink } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';

const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.string().min(1, "Platform name is required"),
  url: z.string().url("Invalid URL").or(z.literal('')),
});

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email address"),
  resumeUrl: z.string().url("Invalid URL for resume").or(z.literal('')),
  avatarUrl: z.string().url("Invalid URL for avatar").optional().or(z.literal('')),
  contactSubtitle: z.string().optional(),
  responseTime: z.string().optional(),
  availability: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
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
      resumeUrl: profile?.resumeUrl || '',
      avatarUrl: profile?.avatarUrl || '',
      contactSubtitle: profile?.contactSubtitle || '',
      responseTime: profile?.responseTime || '',
      availability: profile?.availability || '',
      socialLinks: profile?.socialLinks || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
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
      const profileRef = doc(firestore, "profile", "main");
      await setDoc(profileRef, data, { merge: true });
      
      const result = await updateProfile(data);

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
      console.error("Error updating profile:", error);
      toast({
        title: 'Error',
        description: error.message || "An unexpected error occurred. Please check the console for details.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/resume.pdf" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                   <FormControl>
                    <Input placeholder="https://example.com/avatar.png" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Page</CardTitle>
            <CardDescription>Customize the details shown on your contact page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <FormField
              control={form.control}
              name="contactSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                   <FormControl>
                    <Textarea placeholder="Have a project in mind or want to discuss a potential collaboration?" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="responseTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typical Response Time</FormLabel>
                   <FormControl>
                    <Input placeholder="e.g., 24 hours" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                   <FormControl>
                    <Input placeholder="e.g., Available for remote work" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Social Links</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(index)}
                      aria-label={`Remove social link ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.platform`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Platform</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., GitHub" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/username" {...field} />
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
                  className="mt-4"
                  onClick={() => append({ id: crypto.randomUUID(), platform: '', url: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Social Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
