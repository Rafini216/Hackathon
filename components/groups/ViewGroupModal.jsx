import Modal from "@/components/Modal";
import { Users, FileText, UserCircle2, Tag } from "lucide-react";

export default function ViewGroupModal({ group, onClose }) {
  if (!group) return null;

  return (
    <Modal
      open={!!group}
      onClose={onClose}
      title="Detalhes do Grupo"
      size="md"
    >
      <div className="space-y-6">
        {/* Nome do grupo */}
        <section>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
            <Tag size={14} /> Nome do grupo
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {group.name || "-"}
          </p>
        </section>

        {/* Descrição */}
        <section>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
            <FileText size={14} /> Descrição
          </p>
          <p className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">
            {group.description || "Sem descrição"}
          </p>
        </section>

        {/* Membros */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Users size={14} /> Membros
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {group.members?.length || 0} membro
              {group.members?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {group.members?.length > 0 ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
              {group.members.map((member) => (
                <div
                  key={member._id || member.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <UserCircle2 size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {member.name}
                    </p>
                    {member.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Nenhum membro neste grupo.
            </p>
          )}
        </section>
      </div>
    </Modal>
  );
}
