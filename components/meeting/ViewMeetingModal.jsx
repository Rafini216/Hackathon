import Modal from "@/components/Modal";
import { Calendar, Clock, Users, Tag, CheckCircle2, XCircle } from "lucide-react";

export default function ViewMeetingModal({ meeting, onClose }) {
  if (!meeting) return null;

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  const responseIcons = {
    yes: <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />,
    no: <XCircle size={14} className="text-red-600 dark:text-red-400" />,
  };

  const getParticipantResponse = (participantId) => {
    const response = meeting.responses?.find(
      (r) => r.userId?._id === participantId
    );
    return response?.response || null;
  };

  return (
    <Modal open={!!meeting} onClose={onClose} title="Detalhes da Reunião" size="lg">
      <div className="space-y-8">

        {/* Cabeçalho */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {meeting.title}
          </h3>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar size={15} />
              {new Date(meeting.day).toLocaleDateString("pt-BR")}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={15} />
              {meeting.start} - {meeting.end}
            </div>
            <div className="flex items-center gap-1">
              <Tag size={15} />
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[meeting.status]}`}
              >
                {meeting.status === "pending"
                  ? "Pendente"
                  : meeting.status === "confirmed"
                  ? "Confirmada"
                  : "Cancelada"}
              </span>
            </div>
          </div>
        </section>

        {/* Participantes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
              Participantes
            </h4>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Users size={13} /> {meeting.participants?.length || 0}
            </span>
          </div>

          {meeting.participants?.length ? (
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden">
              {meeting.participants.map((p) => {
                const response = getParticipantResponse(p._id);
                const isYes = response === "yes";
                const isNo = response === "no";

                return (
                  <div
                    key={p._id}
                    className={`flex items-center justify-between px-4 py-3 transition-colors ${
                      isYes
                        ? "bg-green-50 dark:bg-green-900/10"
                        : isNo
                        ? "bg-red-50 dark:bg-red-900/10"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {p.email}
                      </p>
                    </div>
                    {response && (
                      <div className="flex items-center gap-1 text-xs font-medium">
                        {responseIcons[response]}
                        <span
                          className={`${
                            isYes
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {isYes ? "Confirmado" : "Recusado"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Nenhum participante registrado
            </p>
          )}
        </section>

        {/* Informações adicionais */}
        {meeting.notificationSent && (
          <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Notificação
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Notificação enviada aos participantes.
            </p>
          </section>
        )}
      </div>
    </Modal>
  );
}
