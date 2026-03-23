import { useNavigate, useParams } from "react-router-dom";
import { WorkspaceProps } from "../types/workspaces.types";
import { api } from "../services/api";
import { useEffect, useState } from "react";
import { CardWorkspace } from "../components/Card";
import { ProjectsProps } from "../types/projects.types";

export function WorkspacePage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [workspaceDetails, setWorkspaceDetails] =
    useState<WorkspaceProps | null>();

  const getWorkspacesDetail = async () => {
    try {
      const { data } = await api.get<WorkspaceProps>(`/workspaces/${slug}`);
      setWorkspaceDetails(data);
      getWorkspaceProjects(data.id);
    } catch (err) {
      alert("Erro ao buscar Workspace");
    }
  };

  const [workspaceProject, setWorkspaceProject] = useState<ProjectsProps[]>([]);

  const getWorkspaceProjects = async (workspaceId: string) => {
    try {
      const { data } = await api.get<ProjectsProps[]>(
        `/workspaces/${workspaceId}/projects`,
      );
      setWorkspaceProject(data);
    } catch (err) {
      alert("Erro ao buscar projeto");
    }
  };

  useEffect(() => {
    getWorkspacesDetail();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">TaskFlow</h1>
        </header>

        <main className="max-w-5xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Workspace
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors duration-200"
            >
              ↩ Voltar
            </button>
          </div>

          <div>
            {workspaceDetails && (
              <div>
                <CardWorkspace
                  workspace={workspaceDetails}
                  projects={workspaceProject}
                ></CardWorkspace>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
