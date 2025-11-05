import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({ meetings = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredMeetings, setHoveredMeetings] = useState([]);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior para preencher a primeira semana
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Dias do mês atual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      });
    }

    // Dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const getMeetingsForDate = (date) => {
    if (!meetings || meetings.length === 0) return [];
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.day === dateStr);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateHover = (date) => {
    setHoveredDate(formatDate(date));
    const meetingsForDate = getMeetingsForDate(date);
    setHoveredMeetings(meetingsForDate);
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
    setHoveredMeetings([]);
  };

  const handleDateClick = (date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {monthName} {year}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayObj, index) => {
            const dateStr = formatDate(dayObj.date);
            const dayMeetings = getMeetingsForDate(dayObj.date);
            const hasMeetings = dayMeetings.length > 0;
            const isHovered = hoveredDate === dateStr;

            return (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  !dayObj.isCurrentMonth
                    ? "opacity-30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                } ${
                  dayObj.isToday
                    ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-400"
                    : ""
                } ${
                  isHovered ? "bg-blue-100 dark:bg-blue-900/30" : ""
                } rounded-lg p-2 min-h-[3.5rem] flex flex-col`}
                onMouseEnter={() => handleDateHover(dayObj.date)}
                onMouseLeave={handleDateLeave}
                onClick={() => handleDateClick(dayObj.date)}
              >
                <span
                  className={`text-sm font-medium ${
                    dayObj.isToday
                      ? "text-blue-600 dark:text-blue-400"
                      : dayObj.isCurrentMonth
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                  }`}
                >
                  {dayObj.date.getDate()}
                </span>
                {hasMeetings && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dayMeetings.slice(0, 2).map((meeting, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"
                        title={meeting.title}
                      />
                    ))}
                    {dayMeetings.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayMeetings.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip com reuniões ao hover */}
                {isHovered && hasMeetings && (
                  <div className="absolute z-50 top-full left-0 mt-2 w-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {dayObj.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <div className="space-y-2">
                      {dayMeetings.map((meeting, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {meeting.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {meeting.start} - {meeting.end}
                          </p>
                          {meeting.participants && meeting.participants.length > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {Array.isArray(meeting.participants) 
                                ? `${meeting.participants.length} participante${meeting.participants.length > 1 ? 's' : ''}`
                                : 'Nenhum participante'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

