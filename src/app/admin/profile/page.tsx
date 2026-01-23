import { getProfile } from "@/lib/firestore";
import { ProfileForm } from "./ProfileForm";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  return (
     <div className="w-full max-w-4xl mx-auto">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
