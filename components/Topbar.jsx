import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user || !user.name) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = today.toLocaleDateString('pt-BR', options);

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Olá, {user.name}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {dateString}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
