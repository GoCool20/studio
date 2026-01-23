
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
import { firestore } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  surfaceColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
  textPrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),
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

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: theme,
  });

  const onSubmit = async (data: ThemeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 1. Write to database from the client
      const themeRef = doc(firestore, "theme", "main");
      await setDoc(themeRef, data);

      // 2. Call server action to revalidate cache
      const result = await updateTheme(data);

      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        
        // Update CSS variables on the fly for instant preview
        const root = document.documentElement;
        root.style.setProperty('--primary', hexToHsl(data.primaryColor) || '');
        root.style.setProperty('--background', hexToHsl(data.backgroundColor) || '');
        root.style.setProperty('--card', hexToHsl(data.surfaceColor) || '');
        // Note: textPrimaryColor doesn't have a direct CSS variable in the default setup.
        // A more complex setup would be needed to handle text color changes dynamically without a page reload.

        form.reset(data);
      } else {
        toast({
          title: 'Error during revalidation',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch(error) {
      console.error("Error updating theme:", error);
      toast({
          title: 'Error',
          description: "Failed to save theme. Check permissions and try again.",
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
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorInput field={{ control: form.control, name: "primaryColor" }} label="Primary Color" />
            <ColorInput field={{ control: form.control, name: "backgroundColor" }} label="Background Color" />
            <ColorInput field={{ control: form.control, name: "surfaceColor" }} label="Surface Color (Cards)" />
            <ColorInput field={{ control: form.control, name: "textPrimaryColor" }} label="Primary Text Color" />
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
