import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import ViewParticipantModal from "../../components/participants/ViewParticipantModal";
import ViewGroupModal from "../../components/groups/ViewGroupModal";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/context/AuthContext";
import { authAPI, usersAPI, groupsAPI } from "@/services/api";
import { UserPlus, Users, Plus } from "lucide-react";

export default function ParticipantsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { push } = useToast();
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participantForm, setParticipantForm] = useState({ name: "", email: "", password: "" });
  const [groupForm, setGroupForm] = useState({ name: "", description: "", members: [] });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [participantsData, groupsData] = await Promise.all([
        usersAPI.getAll(),
        groupsAPI.getAll()
      ]);
      setParticipants(participantsData);
      setGroups(groupsData);
    } catch (error) {
      push({ variant: "error", title: "Erro ao carregar dados" });
    }
  };

  const createParticipant = async (e) => {
    e.preventDefault();
    if (!participantForm.name || !participantForm.email || !participantForm.password) {
      return push({ variant: "error", title: "Preencha todos os campos obrigatórios" });
    }

    setLoading(true);
    try {
      await authAPI.register(participantForm.name, participantForm.email, participantForm.password);
      setParticipantForm({ name: "", email: "", password: "" });
      setParticipantModalOpen(false);
      push({ variant: "success", title: "Participante criado com sucesso" });
      loadData();
    } catch (error) {
      push({ variant: "error", title: error.message || "Erro ao criar participante" });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name) {
      return push({ variant: "error", title: "Nome do grupo é obrigatório" });
    }

    setLoading(true);
    try {
      await groupsAPI.create(groupForm);
      setGroupForm({ name: "", description: "", members: [] });
      setGroupModalOpen(false);
      push({ variant: "success", title: "Grupo criado com sucesso" });
      loadData();
    } catch (error) {
      push({ variant: "error", title: error.message || "Erro ao criar grupo" });
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberInGroup = (userId) => {
    const isSelected = groupForm.members.includes(userId);
    if (isSelected) {
      setGroupForm({
        ...groupForm,
        members: groupForm.members.filter(id => id !== userId)
      });
    } else {
      setGroupForm({
        ...groupForm,
        members: [...groupForm.members, userId]
      });
    }
  };

  const participantColumns = [
    { key: "name", header: "Nome" },
    { key: "email", header: "Email" },
  ];

  const groupColumns = [
    { key: "name", header: "Nome" },
    {
      key: "description",
      header: "Descrição",
      render: (v) => v || "Sem descrição"
    },
    {
      key: "members",
      header: "Membros",
      render: (v) => Array.isArray(v) ? `${v.length} membro${v.length !== 1 ? 's' : ''}` : "0 membros"
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
              Participantes e Grupos
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gerencie participantes e grupos de reuniões
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setGroupModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              <Users size={18} />
              Novo Grupo
            </button>
            <button
              onClick={() => setParticipantModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <UserPlus size={18} />
              Novo Participante
            </button>
          </div>
        </div>

        {/* Participants Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Participantes</h2>
          <Table
            columns={participantColumns}
            rows={participants}
            emptyLabel="Nenhum participante encontrado"
            renderViewModal={(selected, onClose) => (
              <ViewParticipantModal participant={selected} onClose={onClose} />
            )}
          />

        </div>

        {/* Groups Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Grupos</h2>
          <Table
  columns={groupColumns}
  rows={groups}
  emptyLabel="Nenhum grupo criado"
  renderViewModal={(selected, onClose) => (
    <ViewGroupModal group={selected} onClose={onClose} />
  )}
/>

        </div>

        {/* Participant Modal */}
        <Modal
          open={participantModalOpen}
          onClose={() => {
            setParticipantModalOpen(false);
            setParticipantForm({ name: "", email: "", password: "" });
          }}
          title="Novo Participante"
        >
          <form onSubmit={createParticipant} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome completo
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="Nome do participante"
                value={participantForm.name}
                onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="email@exemplo.com"
                type="email"
                value={participantForm.email}
                onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="••••••••"
                type="password"
                value={participantForm.password}
                onChange={(e) => setParticipantForm({ ...participantForm, password: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setParticipantModalOpen(false);
                  setParticipantForm({ name: "", email: "", password: "" });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Group Modal */}
        <Modal
          open={groupModalOpen}
          onClose={() => {
            setGroupModalOpen(false);
            setGroupForm({ name: "", description: "", members: [] });
          }}
          title="Novo Grupo"
          size="lg"
        >
          <form onSubmit={createGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do grupo
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                placeholder="Nome do grupo"
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none"
                placeholder="Descrição do grupo"
                rows={3}
                value={groupForm.description}
                onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Membros do grupo
              </label>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                {participants.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nenhum participante disponível
                  </p>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {participants.map((participant) => {
                      const isSelected = groupForm.members.includes(participant._id || participant.id);
                      return (
                        <div
                          key={participant._id || participant.id}
                          className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          onClick={() => toggleMemberInGroup(participant._id || participant.id)}
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {participant.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {participant.email}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                : 'border-gray-300 dark:border-gray-600'
                              }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {groupForm.members.length > 0 && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {groupForm.members.length} membro{groupForm.members.length !== 1 ? 's' : ''} selecionado{groupForm.members.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setGroupModalOpen(false);
                  setGroupForm({ name: "", description: "", members: [] });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Grupo"}
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
