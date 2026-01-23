import { createProject } from '@/actions/projects';
import { ProjectForm } from '../ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
        <ProjectForm action={createProject} />
    </div>
  );
}
