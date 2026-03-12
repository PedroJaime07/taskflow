import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { WorkspaceProps } from "../types/workspaces.types";
import { CreateWorkspaceModal } from "../components/ModalWorkspace";
import { api } from "../services/api";

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceProps[]>([]);
  const [newWorkspace, setNewWorkspace] = useState(false);

  const getWorkspaces = async () => {
    try {
      const { data } = await api.get<WorkspaceProps[]>('/workspaces');
      setWorkspace(data);
    } catch (err) {
      alert("Erro ao buscar Workspace");
    }
  };

  useEffect(() => {
    getWorkspaces();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">TaskFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Olá, {user?.name}</span>
          <button
            onClick={signOut}
            className="text-sm text-red-500 hover:underline"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Meus Workspaces
          </h2>
          <button
            onClick={() => setNewWorkspace(true)}
            className="px-3 py-1 p-4 bg-white rounded-xl shadow-sm border rounded-lg hover:bg-gray-200 transition"
          >
            +
          </button>
          {newWorkspace && (
            <CreateWorkspaceModal
              onClose={() => {
                setNewWorkspace(false);
                getWorkspaces();
              }}
            />
          )}
        </div>

        {workspace.length > 0 ? (
          workspace.map((element) => (
            <div key={element.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              <span className="text-gray-800 font-medium">{element.name}</span>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {element._count.projects}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Nenhum workspace ainda.</p>
        )}
      </main>
    </div>
  );
}
