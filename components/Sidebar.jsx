import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, CalendarCheck, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(true);
  const [floatingOnDesktop, setFloatingOnDesktop] = useState(false);

  const publicPages = ['/login', '/register'];
  const shouldHide = !user || publicPages.includes(router.pathname);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
        setFloatingOnDesktop(false);
      } else {
        setOpen(true);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const menu = [
    { name: "Dashboard", path: "/Dashboard", icon: LayoutDashboard },
    { name: "Participantes", path: "/participants", icon: Users },
    { name: "Reuniões", path: "/meetings", icon: CalendarCheck },
  ];

  const handleClose = () => {
    setOpen(false);
    setFloatingOnDesktop(false);
  };

  const handleOpen = () => {
    if (isMobile) {
      setOpen(true);
    } else {
      setFloatingOnDesktop(true);
      setOpen(true);
    }
  };

  if (shouldHide) {
    return null;
  }

  return (
    <>
      {open && (isMobile || floatingOnDesktop) && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => {
            if (isMobile) {
              handleClose();
            } else {
              setFloatingOnDesktop(false);
            }
          }}
        />
      )}

      {!open && (
        <div className="fixed left-0 top-0 z-50 h-screen w-12 flex items-start justify-center pt-8">
          <button
            aria-label="Abrir menu"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            onClick={handleOpen}
          >
            <PanelLeftOpen size={20} />
          </button>
        </div>
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center justify-center gap-2"> <img src="/logo.png" alt="Meeteasy Logo" className="w-8 h-8" />MeetEasy</h1>
          <button
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            onClick={() => (open ? handleClose() : handleOpen())}
          >
            {open ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => {
                  if (isMobile) handleClose();
                }}
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {!isMobile && open && !floatingOnDesktop && <div className="w-64" />}
      {!open && <div className="w-12" />}
    </>
  );
}
