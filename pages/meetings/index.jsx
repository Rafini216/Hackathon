import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Modal from "@/components/Modal";
import ViewMeetingModal from "../../components/meeting/ViewMeetingModal";
import Table from "@/components/Table";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/context/AuthContext";
import { meetingsAPI, usersAPI, groupsAPI } from "@/services/api";
import { Calendar as CalendarIcon, Plus, Clock, Users as UsersIcon } from "lucide-react";

export default function MeetingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", day: "", start: "", end: "", participants: [] });
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      loadMeetings();
      loadUsers();
      loadGroups();
    }
  }, [user]);

  const loadMeetings = async () => {
    try {
      const data = await meetingsAPI.getAll();
      setMeetings(data);
    } catch (error) {
      push({ variant: "error", title: "Erro ao carregar reuniões" });
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      push({ variant: "error", title: "Erro ao carregar usuários" });
    }
  };

  const loadGroups = async () => {
    try {
      const data = await groupsAPI.getAll();
      setGroups(data);
    } catch (error) {
      // Não mostrar erro se não houver grupos
    }
  };

  const handleGroupSelect = (groupId) => {
    if (groupId) {
      const group = groups.find(g => (g._id || g.id) === groupId);
      if (group && group.members) {
        const memberIds = group.members.map(m => m._id || m.id || m);
        setForm({ ...form, participants: [...new Set([...form.participants, ...memberIds])] });
        setSelectedGroup(groupId);
      }
    } else {
      setSelectedGroup(null);
    }
  };

  const createMeeting = async (e) => {
    e.preventDefault();
    if (!form.title || !form.day || !form.start || !form.end) {
      return push({ variant: "error", title: "Preencha os campos obrigatórios" });
    }
    if (form.participants.length === 0) {
      return push({ variant: "error", title: "Adicione pelo menos um participante" });
    }

    setLoading(true);
    try {
      const meetingData = {
        title: form.title,
        day: form.day,
        start: form.start,
        end: form.end,
        participants: form.participants
      };
      
      await meetingsAPI.create(meetingData);
      setForm({ title: "", day: "", start: "", end: "", participants: [] });
      setSelectedGroup(null);
      setOpen(false);
      push({ variant: "success", title: "Reunião criada com sucesso" });
      loadMeetings();
    } catch (error) {
      push({ variant: "error", title: error.message || "Erro ao criar reunião" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "title", header: "Título" },
    { 
      key: "day", 
      header: "Data",
      render: (v) => {
        if (!v) return "-";
        const date = new Date(v);
        return date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }
    },
    { 
      key: "time", 
      header: "Horário", 
      render: (v, row) => `${row.start || ""} - ${row.end || ""}` 
    },
    { 
      key: "status", 
      header: "Status",
      render: (v) => {
        const statusMap = {
          pending: { label: "Pendente", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
          confirmed: { label: "Confirmada", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
          cancelled: { label: "Cancelada", class: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" }
        };
        const status = statusMap[v] || { label: v, class: "" };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
            {status.label}
          </span>
        );
      }
    },
    { 
      key: "participants", 
      header: "Participantes", 
      render: (v) => {
        const count = Array.isArray(v) ? v.length : 0;
        return (
          <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <UsersIcon size={14} />
            {count}
          </span>
        );
      }
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <Topbar />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Reuniões
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas reuniões e participantes
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus size={18} />
            Nova Reunião
          </button>
        </div>

        <Table
  columns={columns}
  rows={meetings}
  emptyLabel="Nenhuma reunião cadastrada"
  renderViewModal={(selected, onClose) => (
    <ViewMeetingModal meeting={selected} onClose={onClose} />
  )}
/>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
            setForm({ title: "", day: "", start: "", end: "", participants: [] });
            setSelectedGroup(null);
          }}
          title="Nova Reunião"
          size="lg"
        >
          <form onSubmit={createMeeting} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título da reunião
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="Ex: Reunião de planejamento"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    type="date"
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Início
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    type="time"
                    value={form.start}
                    onChange={(e) => setForm({ ...form, start: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fim
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                    type="time"
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Groups Selection */}
            {groups.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adicionar grupo
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                  value={selectedGroup || ""}
                  onChange={(e) => handleGroupSelect(e.target.value || null)}
                >
                  <option value="">Selecione um grupo (opcional)</option>
                  {groups.map((group) => (
                    <option key={group._id || group.id} value={group._id || group.id}>
                      {group.name} ({Array.isArray(group.members) ? group.members.length : 0} membros)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Participants Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Participantes ({form.participants.length})
              </label>

              {form.participants.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-3">
                    Participantes adicionados:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.participants.map((participantId) => {
                      const participant = users.find(u => (u._id || u.id) === participantId);
                      if (!participant) return null;
                      return (
                        <div
                          key={participantId}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full text-sm text-blue-700 dark:text-blue-300"
                        >
                          <span>{participant.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setForm({
                                ...form,
                                participants: form.participants.filter(id => id !== participantId)
                              });
                            }}
                            className="text-blue-500 hover:text-red-600 dark:text-blue-400 dark:hover:text-red-400 font-bold transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border border-gray-300 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto bg-white dark:bg-gray-900">
                {users.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nenhum usuário disponível
                  </p>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {users.map((user) => {
                      const isAdded = form.participants.includes(user._id || user.id);
                      return (
                        <div
                          key={user._id || user.id}
                          className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            isAdded ? 'bg-blue-50 dark:bg-blue-900/20 opacity-75' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const userId = user._id || user.id;
                              if (isAdded) {
                                setForm({
                                  ...form,
                                  participants: form.participants.filter(id => id !== userId)
                                });
                              } else {
                                setForm({
                                  ...form,
                                  participants: [...form.participants, userId]
                                });
                              }
                            }}
                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                              isAdded
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                            }`}
                          >
                            {isAdded ? 'Remover' : 'Adicionar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {form.participants.length === 0 && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Clique em "Adicionar" para incluir participantes na reunião
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setForm({ title: "", day: "", start: "", end: "", participants: [] });
                  setSelectedGroup(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </span>
                ) : (
                  "Criar Reunião"
                )}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
