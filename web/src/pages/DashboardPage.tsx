import { useAuth } from '../contexts/AuthContext'

export function DashboardPage() {
  const { user, signOut } = useAuth()

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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Meus Workspaces
        </h2>
        <p className="text-gray-500 text-sm">Nenhum workspace ainda.</p>
      </main>
    </div>
  )
}
