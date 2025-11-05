import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useToast } from "@/components/ToastProvider";

export default function EditEntity() {
  const router = useRouter();
  const { entity, id } = router.query;
  const { push } = useToast();

  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!entity || !id) return;
    const key = String(entity);
    const raw = localStorage.getItem(key);
    try {
      const arr = raw ? JSON.parse(raw) : [];
      setData(arr.find((x) => String(x.id) === String(id)) || null);
    } catch {
      setData(null);
    }
    setLoaded(true);
  }, [entity, id]);

  const onSave = () => {
    if (!data) return;
    const raw = localStorage.getItem(String(entity));
    const arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((x) => String(x.id) === String(id));
    if (idx >= 0) {
      arr[idx] = data;
      localStorage.setItem(String(entity), JSON.stringify(arr));
      push({ variant: "success", title: "Alterações salvas" });
    }
  };

  if (!loaded) return null;

  return (
    <div className="flex min-h-screen bg-background dark:bg-darkBg">
      <Sidebar />
      <main className="flex-1 p-8">
        <Topbar />
        <h2 className="text-xl font-semibold mb-4">Editar: {entity} #{id}</h2>
        {!data ? (
          <div className="opacity-70">Registro não encontrado</div>
        ) : (
          <div className="space-y-3 max-w-lg">
            {Object.keys(data).map((k) => (
              k === "id" ? (
                <div key={k} className="text-sm opacity-70">ID: {data[k]}</div>
              ) : (
                <div key={k}>
                  <label className="text-sm block mb-1">{k}</label>
                  <input className="w-full p-2 border rounded-md dark:bg-gray-700" value={String(data[k] ?? "")} onChange={(e) => setData({ ...data, [k]: e.target.value })} />
                </div>
              )
            ))}
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-md border" onClick={() => router.back()}>Voltar</button>
              <button className="px-3 py-2 rounded-md bg-primary text-white" onClick={onSave}>Salvar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


