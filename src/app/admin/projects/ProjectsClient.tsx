
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteProjectAction } from '@/actions/projects';
import type { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MoreHorizontal, PlusCircle, Trash2, XCircle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { user, firestore } = useAuth();


  const handleDelete = async () => {
    if (!projectToDelete) return;
    
    if (!user) {
      toast({ title: 'Authentication Error', description: 'Please log in to perform this action.', variant: 'destructive' });
      setShowDeleteDialog(false);
      return;
    }

    try {
      await deleteDoc(doc(firestore, "projects", projectToDelete));
      
      startTransition(() => {
        deleteProjectAction();
      });

      toast({ title: 'Success', description: 'Project deleted successfully.' });
    } catch(error: any) {
      console.error('Error deleting project', error)
      toast({ title: 'Error', description: error.message || "Failed to delete project.", variant: 'destructive' });
    } finally {
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setProjectToDelete(id);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  {project.featured ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-muted-foreground" />}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem asChild>
                           <Link href={`/admin/projects/edit/${project.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(project.id)} className="text-destructive">
                           Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
