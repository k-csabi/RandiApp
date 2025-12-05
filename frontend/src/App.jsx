import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import api from './api';

// Komponensek importálása
import DateWheel from './components/DateWheel';
import DateList from './components/DateList';
import BucketList from './components/BucketList';
import Profile from './components/Profile';
import Journal from './components/Journal'; // Az új Napló komponens

// Védett útvonal ellenőrzés
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

const Dashboard = () => {
  // Nézetek: 'dashboard' (főoldal), 'journal' (napló), 'profile' (profil)
  const [view, setView] = useState('dashboard');
  const [dates, setDates] = useState([]);

  // Randik lekérése (kell a keréknek és a listának is)
  const fetchDates = async () => {
    try {
      const res = await api.get('/dates');
      setDates(res.data);
    } catch (err) { console.error("Hiba a randik lekérésekor", err); }
  };

  useEffect(() => { fetchDates(); }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">

      {/* --- FEJLÉC ÉS MENÜ --- */}
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

          {/* Logó (kattintható, visszavisz a főoldalra) */}
          <h1
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 cursor-pointer hover:scale-105 transition"
            onClick={() => setView('dashboard')}
          >
            RandiApp ❤️
          </h1>

          {/* Menü gombok */}
          <div className="flex gap-3">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-full font-bold transition ${view === 'dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              🏠 Főoldal
            </button>
            <button
              onClick={() => setView('journal')}
              className={`px-4 py-2 rounded-full font-bold transition ${view === 'journal' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              📖 Napló
            </button>
            <button
              onClick={() => setView('profile')}
              className={`px-4 py-2 rounded-full font-bold transition ${view === 'profile' ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              👤 Profil
            </button>
          </div>
        </div>
      </nav>

      {/* --- FŐ TARTALOM --- */}
      <main className="flex-1 w-full p-4 max-w-[1600px] mx-auto overflow-hidden">

        {/* 1. PROFIL NÉZET */}
        {view === 'profile' && (
          <div className="flex justify-center mt-6 animate-fade-in">
            <Profile />
          </div>
        )}

        {/* 2. NAPLÓ NÉZET */}
        {view === 'journal' && (
          <div className="max-w-3xl mx-auto mt-6 h-[85vh] animate-fade-in">
            <Journal />
          </div>
        )}

        {/* 3. FŐOLDAL (DASHBOARD) - 3 Oszlopos Grid */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fade-in">

            {/* BAL OSZLOP: Bakancslista */}
            <div className="order-2 lg:order-1 h-full">
              <div className="bg-white rounded-xl shadow-lg p-2 h-full max-h-[85vh] overflow-y-auto border border-gray-100">
                <BucketList />
              </div>
            </div>

            {/* KÖZÉPSŐ OSZLOP: Szerencsekerék */}
            <div className="order-1 lg:order-2 flex flex-col items-center justify-start">
               <div className="bg-white rounded-xl shadow-xl p-6 w-full flex flex-col items-center border border-gray-100 sticky top-4">
                 <DateWheel dates={dates} />
               </div>
            </div>

            {/* JOBB OSZLOP: Randi Lista */}
            <div className="order-3 lg:order-3 h-full">
              <div className="bg-white rounded-xl shadow-lg p-4 h-full max-h-[85vh] overflow-y-auto border border-gray-100">
                 <div className="sticky top-0 bg-white z-10 pb-2 border-b mb-4">
                    <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                      📅 Randi Ötlettár
                      <span className="text-sm bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{dates.length}</span>
                    </h3>
                 </div>
                 <DateList dates={dates} refreshDates={fetchDates} />
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;