import { useState } from 'react';
import { Moon, Sun, Bug, Mail } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200 p-4`}>
      <div className="w-full max-w-md">

        <h1 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>

        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
            I
          </div>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Inácio
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            SyncKrono® Founder
          </p>
        </div>

        <div className={`w-full flex items-center justify-between py-4 px-4 mb-6 rounded-lg transition-colors ${
          darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            {darkMode ? (
              <Moon className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            ) : (
              <Sun className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
            )}
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {darkMode ? 'Dark mode' : 'Light mode'}
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              darkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button className={`w-full flex items-center justify-between py-4 px-4 mb-6 rounded-lg transition-colors ${
          darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            <Bug className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Report Bugs
            </span>
          </div>
          <span className={`text-2xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>›</span>
        </button>

        <button className={`w-full flex items-center justify-between py-4 px-4 rounded-lg transition-colors ${
          darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-100'
        } shadow-sm`}>
          <div className="flex items-center space-x-3">
            <Mail className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact Us
            </span>
          </div>
          <span className={`text-2xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>›</span>
        </button>

      </div>
    </div>
  );
}