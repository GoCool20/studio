
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateTheme } from '@/actions/theme';
import type { Theme } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { hexToHsl } from '@/lib/utils';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  surfaceColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  textPrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  useGradientBorder: z.boolean(),
  gradientStartColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  gradientEndColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

function ColorInput({ field, label }: { field: any; label: string }) {
    return (
        <FormField
            control={field.control}
            name={field.name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <div className="flex items-center gap-2">
                        <Input type="color" className="w-12 h-10 p-1" {...field} />
                        <FormControl>
                            <Input placeholder="#FFFFFF" {...field} />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export function ThemeForm({ theme }: { theme: Theme }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, firestore } = useAuth();

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: theme,
  });

  const useGradient = form.watch('useGradientBorder');

  const onSubmit = async (data: ThemeFormValues) => {
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
      const themeRef = doc(firestore, "theme", "main");
      await setDoc(themeRef, data);

      const result = await updateTheme(data);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        
        const root = document.documentElement;
        root.style.setProperty('--primary', hexToHsl(data.primaryColor) || '');
        root.style.setProperty('--background', hexToHsl(data.backgroundColor) || '');
        root.style.setProperty('--card', hexToHsl(data.surfaceColor) || '');
        root.style.setProperty('--foreground', hexToHsl(data.textPrimaryColor) || '');

        if (data.useGradientBorder) {
            root.style.setProperty('--gradient-start', hexToHsl(data.gradientStartColor) || '');
            root.style.setProperty('--gradient-end', hexToHsl(data.gradientEndColor) || '');
        }
        
        // This will trigger the ThemeApplicator on next page load, but we can manually toggle a class for instant preview
        if (data.useGradientBorder) {
          document.body.classList.add('use-gradient-border');
        } else {
          document.body.classList.remove('use-gradient-border');
        }

        form.reset(data);
      } else {
        toast({
          title: 'Error during revalidation',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch(error: any) {
      console.error("Error updating theme:", error);
      toast({
          title: 'Error',
          description: error.message || "Failed to save theme. Check permissions and try again.",
          variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Site Theme</CardTitle>
            <CardDescription>Customize the main colors of your website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorInput field={{ control: form.control, name: "primaryColor" }} label="Primary Color" />
                <ColorInput field={{ control: form.control, name: "backgroundColor" }} label="Background Color" />
                <ColorInput field={{ control: form.control, name: "surfaceColor" }} label="Surface Color (Cards)" />
                <ColorInput field={{ control: form.control, name: "textPrimaryColor" }} label="Primary Text Color" />
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                 <FormField
                  control={form.control}
                  name="useGradientBorder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className='space-y-0.5'>
                        <FormLabel>Use Gradient Borders</FormLabel>
                        <FormDescription>
                            Apply a gradient border to cards and primary buttons.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {useGradient && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <ColorInput field={{ control: form.control, name: "gradientStartColor" }} label="Gradient Start" />
                        <ColorInput field={{ control: form.control, name: "gradientEndColor" }} label="Gradient End" />
                    </div>
                )}
            </div>
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
