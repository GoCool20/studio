import { getProjectById } from '@/lib/firestore';
import { updateProject } from '@/actions/projects';
import { ProjectForm } from '../../ProjectForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, params.id);

  return (
    <div className="w-full max-w-4xl mx-auto">
        <ProjectForm action={updateProjectWithId} initialData={project} />
    </div>
  );
}
