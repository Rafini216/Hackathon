import Link from 'next/link';
import { useRouter } from 'next/router';
import { Roboto } from 'next/font/google';
import { Users } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import { Settings } from 'lucide-react';
import { LogOut } from 'lucide-react';

const robotoFont = Roboto({
  subsets: ["latin"],
  weight: "variable",
});

export default function Sidebar() {
  const router = useRouter()
  const isActive = (path) => router.pathname === path

  return (
    <nav className="bg-[#f6f6f6] dark:bg-[#101a21] text-[#101a21] dark:text-[rgb(246,246,246)] fixed left-0 h-full justify-end flex flex-col shadow-[0_0px_10px_rgba(0,0,0,0.5)] rounded-r-lg p-2 md:w-[300px]">
      <div className="flex flex-col max-h-screen gap-3">

        {/* Participantes e Grupos com search bar e filtros */}
        <Link href="/" className={isActive('/') ? 'dark:text-[#dbdb78] text-[#3892A8]' : ''}>
        <div className="flex flex-row text-2xl p-4 rounded-[10px] hover:bg-[#e2e9ee] dark:hover:bg-[#32393e] align-center">
          <div src="/users.svg" className="">
            <Users size={30} />
          </div>
          <p className={`${robotoFont.className} text-[18px] pl-10 hidden lg:block`}>Participantes</p>         
        </div>
        </Link>

        {/* Calendário */}
        <Link href="/" className={isActive('/') ? 'dark:text-[#dbdb78] text-[#3892A8]' : ''}>
        <div className="flex flex-row text-2xl p-4 rounded-[10px] hover:bg-[#e2e9ee] dark:hover:bg-[#32393e] align-center">
          <div src="/users.svg" className="">
            <CalendarDays size={30} />
          </div>
          <p className={`${robotoFont.className} text-[18px] pl-10 hidden lg:block`}>Calendário</p>         
        </div>
        </Link>

        {/* Settings */}
        <Link href="/" className={isActive('/') ? 'dark:text-[#dbdb78] text-[#3892A8]' : ''}>
        <div className="flex flex-row text-2xl p-4 rounded-[10px] hover:bg-[#e2e9ee] dark:hover:bg-[#32393e] align-center">
          <div src="/users.svg" className="">
            <Settings size={30} />
          </div>
          <p className={`${robotoFont.className} text-[18px] pl-10 hidden lg:block`}>Definições</p>         
        </div>
        </Link>

        {/* Log out */}
        <Link href="/">
        <div className="flex flex-row text-2xl p-4 rounded-[10px] bg-[#EE6E4D] hover:bg-[#db5736] align-center self-end-safe">
          <div src="/users.svg" className="">
            <LogOut size={30} />
          </div>
          <p className={`${robotoFont.className} text-[18px] pl-10 hidden lg:block`}>Terminar Sessão</p>         
        </div>
        </Link>
  
      </div>
    </nav>
  )
}
    /* <main className="rounded-[10px] p-6">
      Perfil. NÃO CLICKÁVEL
      <div>

      </div>

      Participantes e Grupos c/ search bar e filtros
      <div>

      </div>

      Calendário
      <div>

      </div>

      Sign out
      <div>

      </div>
    </main> */
