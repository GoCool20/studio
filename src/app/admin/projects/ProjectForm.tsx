'use client';

import { useFormState, useFormStatus } from 'react-dom';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

type ProjectFormProps = {
  action: (payload: FormData) => void;
  initialData?: Project | null;
};

const initialState = {
  errors: {},
};

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isUpdate ? 'Update Project' : 'Create Project'}
    </Button>
  );
}

export function ProjectForm({ action, initialData }: ProjectFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <CardDescription>
            {initialData ? 'Update the details of your project.' : 'Fill in the details to add a new project.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={initialData?.title} />
            {state?.errors?.title && <p className="text-sm text-destructive">{state.errors.title}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" name="shortDescription" defaultValue={initialData?.shortDescription} />
             {state?.errors?.shortDescription && <p className="text-sm text-destructive">{state.errors.shortDescription}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="detailedDescription">Detailed Description</Label>
            <Textarea id="detailedDescription" name="detailedDescription" defaultValue={initialData?.detailedDescription} />
             {state?.errors?.detailedDescription && <p className="text-sm text-destructive">{state.errors.detailedDescription}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
            <Input id="techStack" name="techStack" defaultValue={initialData?.techStack?.join(', ')} />
             {state?.errors?.techStack && <p className="text-sm text-destructive">{state.errors.techStack}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={initialData?.imageUrl} />
             {state?.errors?.imageUrl && <p className="text-sm text-destructive">{state.errors.imageUrl}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" defaultValue={initialData?.githubUrl} />
             {state?.errors?.githubUrl && <p className="text-sm text-destructive">{state.errors.githubUrl}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="liveDemoUrl">Live Demo URL</Label>
            <Input id="liveDemoUrl" name="liveDemoUrl" defaultValue={initialData?.liveDemoUrl} />
             {state?.errors?.liveDemoUrl && <p className="text-sm text-destructive">{state.errors.liveDemoUrl}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" name="featured" defaultChecked={initialData?.featured} />
            <Label htmlFor="featured">Featured Project</Label>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <SubmitButton isUpdate={!!initialData} />
          <Button variant="outline" asChild>
              <Link href="/admin/projects">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
