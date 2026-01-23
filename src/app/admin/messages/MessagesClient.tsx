
'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { revalidateMessages } from '@/actions/messages';
import type { Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Mail, MailOpen, Trash2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

type SerializableMessage = Omit<Message, 'createdAt'> & { createdAt: string };

export function MessagesClient({ messages }: { messages: SerializableMessage[] }) {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { user, firestore } = useAuth();

  const handleToggleRead = async (id: string, read: boolean) => {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'Please log in to perform this action.', variant: 'destructive' });
      return;
    }
    try {
      const messageRef = doc(firestore, 'messages', id);
      await updateDoc(messageRef, { read: !read });
      startTransition(() => {
        revalidateMessages();
      });
    } catch (error: any) {
      console.error('Error toggling message read status:', error);
      toast({ title: 'Error', description: error.message || 'Failed to update message.', variant: 'destructive' });
    }
  };

  const openDeleteDialog = (id: string) => {
    setMessageToDelete(id);
    setShowDeleteDialog(true);
  };
  
  const handleDelete = async () => {
    if (!messageToDelete) return;

    if (!user) {
      toast({ title: 'Authentication Error', description: 'Please log in to perform this action.', variant: 'destructive' });
      setShowDeleteDialog(false);
      return;
    }

    try {
      await deleteDoc(doc(firestore, "messages", messageToDelete));
      startTransition(() => {
        revalidateMessages();
      });
      toast({ title: 'Success', description: 'Message deleted.' });
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast({ title: 'Error', description: error.message || 'Failed to delete message.', variant: 'destructive' });
    } finally {
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    }
  }

  if (messages.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg">
            <Inbox className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">No Messages Yet</h2>
            <p className="text-muted-foreground">Your contact form submissions will appear here.</p>
        </div>
    )
  }

  return (
    <>
      <Accordion type="multiple" className="w-full">
        {messages.map((message) => (
          <AccordionItem key={message.id} value={message.id} className={cn("border rounded-lg mb-2", !message.read && "bg-secondary/50")}>
            <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex justify-between items-center w-full">
                 <div className="flex items-center gap-4">
                    {!message.read ? <Mail className="h-5 w-5 text-primary" /> : <MailOpen className="h-5 w-5 text-muted-foreground" />}
                    <div className="text-left">
                        <p className={cn("font-semibold", !message.read && "text-primary")}>{message.name}</p>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(message.createdAt), 'PPP p')}
                    </span>
                 </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
                <div className="prose prose-sm dark:prose-invert max-w-none bg-background/50 rounded-lg p-4 border">
                    {message.message}
                </div>
                 <div className="mt-4 flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleToggleRead(message.id, message.read)} disabled={isPending}>
                      {message.read ? <Mail className="mr-2 h-4 w-4"/> : <MailOpen className="mr-2 h-4 w-4"/>}
                      {message.read ? 'Mark as Unread' : 'Mark as Read'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(message.id)} disabled={isPending}>
                      <Trash2 className="mr-2 h-4 w-4"/> Delete
                    </Button>
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
