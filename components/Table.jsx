import { useState } from "react";
import Modal from "@/components/Modal";
import { Eye } from "lucide-react";

export default function Table({
  columns,
  rows,
  title = "",
  emptyLabel = "Nenhum dado disponível",
  renderViewModal, // nova prop opcional
}) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {c.header}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {emptyLabel}
                  </td>
                </tr>
              )}
              {rows.map((row, index) => (
                <tr
                  key={row._id || row.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelected(row)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Compatível: se o dev passou um renderViewModal, usa ele.
          Caso contrário, mantém o modal genérico atual */}
      {renderViewModal ? (
        renderViewModal(selected, () => setSelected(null))
      ) : (
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Detalhes"
          size="lg"
        >
          {selected && (
            <div className="space-y-4">
              {Object.entries(selected).map(([key, value]) => (
                <div
                  key={key}
                  className="border-b border-gray-200 dark:border-gray-800 pb-3 last:border-0"
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    {key}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 break-words whitespace-pre-wrap">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
