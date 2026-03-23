import type { WorkspaceProps } from "../../types/workspaces.types";

type Props = {
  workspace: WorkspaceProps;
};

export const CardWorkspace = ({ workspace }: Props) => {
  const projectCount = workspace._count?.projects ?? 0;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <p className="text-lg font-semibold text-gray-900 mb-2">{workspace.name}</p>
      <p className="text-gray-600 text-sm">
        Projetos:
        {projectCount
          ? projectCount
          : " Não tem nenhum projeto"}
      </p>
    </div>
  );
};
