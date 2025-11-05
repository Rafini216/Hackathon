import Modal from "@/components/Modal";

export default function ViewParticipantModal({ participant, onClose }) {
  if (!participant) return null;

  return (
    <Modal
      open={!!participant}
      onClose={onClose}
      title="Detalhes do Participante"
      size="md"
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {participant.name || "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">E-mail</p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">
            {participant.email || "-"}
          </p>
        </div>

        {participant.phone && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Telefone</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {participant.phone}
            </p>
          </div>
        )}

        {participant.role && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Função</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {participant.role}
            </p>
          </div>
        )}

        {participant.groups?.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Grupos
            </p>
            <ul className="space-y-1">
              {participant.groups.map((g) => (
                <li
                  key={g._id || g.id}
                  className="text-sm text-gray-800 dark:text-gray-200"
                >
                  {g.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {participant.status && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Status
            </p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                participant.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {participant.status === "active" ? "Ativo" : participant.status}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
