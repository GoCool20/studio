
import { getProjectById } from '@/lib/firestore';
import { ProjectForm } from '../../ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
        <ProjectForm initialData={project} />
    </div>
  );
}
