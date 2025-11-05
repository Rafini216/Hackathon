import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Calendar, Users, Clock, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import CalendarComponent from "@/components/Calendar";
import { useAuth } from "@/context/AuthContext";
import { meetingsAPI, usersAPI } from "@/services/api";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    confirmedMeetings: 0,
    pendingMeetings: 0,
    totalUsers: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [meetingsData, usersData] = await Promise.all([
        meetingsAPI.getAll(),
        usersAPI.getAll()
      ]);
      
      setMeetings(meetingsData);
      setUsers(usersData);

      // Calcular estatísticas
      const totalMeetings = meetingsData.length;
      const confirmedMeetings = meetingsData.filter(m => m.status === 'confirmed').length;
      const pendingMeetings = meetingsData.filter(m => m.status === 'pending').length;

      setStats({
        totalMeetings,
        confirmedMeetings,
        pendingMeetings,
        totalUsers: usersData.length
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleDateClick = (date) => {
    router.push(`/meetings?date=${date.toISOString().split('T')[0]}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <Topbar />
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Reuniões</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalMeetings}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmadas</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.confirmedMeetings}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{stats.pendingMeetings}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Participantes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="max-w-5xl">
          <CalendarComponent meetings={meetings} onDateClick={handleDateClick} />
        </div>

        {/* Upcoming Meetings */}
        {meetings.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Próximas Reuniões</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {meetings
                  .filter(meeting => {
                    const meetingDate = new Date(meeting.day);
                    return meetingDate >= new Date();
                  })
                  .sort((a, b) => new Date(a.day) - new Date(b.day))
                  .slice(0, 5)
                  .map((meeting) => (
                    <div
                      key={meeting._id || meeting.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{meeting.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(meeting.day).toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })} • {meeting.start} - {meeting.end}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          meeting.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : meeting.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {meeting.status === 'confirmed' ? 'Confirmada' : meeting.status === 'pending' ? 'Pendente' : 'Cancelada'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
