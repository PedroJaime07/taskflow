import type { ProjectsProps } from "../../types/projects.types";
import type { WorkspaceProps } from "../../types/workspaces.types";

type Props = {
  workspace: WorkspaceProps;
  projects: ProjectsProps[]
};

export const CardWorkspace = ({ workspace, projects }: Props) => {
  const projectCount = projects.length > 0;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <p className="text-lg font-semibold text-gray-900 mb-2">{workspace.name}</p>
      {projectCount ? (<ul className="space-y-2">
        {projects.map((e) => (<li key={e.id} className="p-2 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center">
          <span>{e.name}</span>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {e._count.tasks} tarefas
              </span>
        </li>))}
      </ul>) : (<p className="text-gray-500 text-sm">Não há projetos neste workspace.</p>)}
    </div>
  );
};
