import { getMessages } from "@/lib/firestore";
import { MessagesClient } from "./MessagesClient";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="w-full">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Messages</h1>
      <MessagesClient messages={messages} />
    </div>
  );
}
