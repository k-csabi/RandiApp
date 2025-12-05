import { useState, useEffect } from 'react';
import api from '../api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');


  const avatars = ['🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🦄', '👽', '🐺','🐻‍❄️', '🐻', '🐰', '🦝', '🦍', '🐒', '🦖'];

  useEffect(() => {
    api.get('/user/me').then(res => {
        setProfile(res.data);
        if(res.data.relationshipStart) setDateInput(res.data.relationshipStart);
        if(res.data.avatar) setSelectedAvatar(res.data.avatar);
    });
  }, []);

  const handleSave = async () => {
    await api.put('/user/update', {
        avatar: selectedAvatar,
        relationshipStart: dateInput
    });
    setEditMode(false);
    window.location.reload();
  };

  const calculateDays = (start) => {
    if (!start) return { together: 0, next: 0 };
    const startDate = new Date(start);
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const currentYear = now.getFullYear();
    let nextAnniv = new Date(start);
    nextAnniv.setFullYear(currentYear);
    if (nextAnniv < now) nextAnniv.setFullYear(currentYear + 1);
    const diffAnniv = Math.ceil((nextAnniv - now) / (1000 * 60 * 60 * 24));

    return { together: diffDays, next: diffAnniv };
  };

  if (!profile) return <div>Betöltés...</div>;
  const stats = calculateDays(profile.relationshipStart);

  return (
    
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto mt-6">

        {}
        <div className="flex justify-between items-center gap-4 mb-10 px-4">

            {}
            <div className="flex flex-col items-center w-1/3">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl shadow-md border-4 border-white relative shrink-0">
                    {profile.avatar || '👤'}
                    <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-sm">TE</span>
                </div>
                <p className="font-bold mt-3 text-lg text-gray-800 text-center break-words w-full px-2">{profile.name}</p>
            </div>

            {}
            <div className="text-center w-1/3 flex flex-col items-center">
                <div className="text-5xl animate-pulse drop-shadow-md mb-2">❤️</div>
                {profile.relationshipStart ? (
                    <div className="text-sm font-bold text-pink-600 bg-pink-100 px-4 py-1 rounded-full whitespace-nowrap shadow-sm">
                        {stats.together} napja!
                    </div>
                ) : (
                    <div className="text-xs text-gray-400 italic">Mikor jöttetek össze?</div>
                )}
            </div>

            {}
            <div className="flex flex-col items-center w-1/3">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-5xl shadow-md border-4 border-white shrink-0">
                    {profile.partnerAvatar || '👤'}
                </div>
                {}
                <p className={`font-bold mt-3 text-gray-800 text-center break-words w-full px-2 ${profile.partnerName.length > 15 ? 'text-sm' : 'text-lg'}`}>
                    {profile.partnerName}
                </p>
            </div>
        </div>

        {}
        {editMode ? (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200 animate-fade-in max-w-xl mx-auto">
                <h3 className="font-bold mb-4 text-purple-700 text-center">Profil szerkesztése</h3>

                <label className="block text-sm font-bold mb-2 text-gray-600">Válaszd ki a saját Avatarodat:</label>
                <div className="flex gap-2 mb-6 overflow-x-auto p-2 scrollbar-hide md:justify-start">
                    {avatars.map(a => (
                        <button
                            key={a}
                            onClick={() => setSelectedAvatar(a)}
                            className={`text-3xl p-3 rounded-lg transition transform hover:scale-110 flex-shrink-0 w-16 h-16 flex items-center justify-center ${selectedAvatar === a ? 'bg-purple-200 shadow-inner scale-110' : 'bg-white border hover:bg-gray-100'}`}
                        >
                            {a}
                        </button>
                    ))}
                </div>

                <label className="block text-sm font-bold mb-2 text-gray-600">Mikor jöttetek össze? (Közös adat)</label>
                <input type="date" className="border p-2 rounded w-full mb-6" value={dateInput} onChange={e => setDateInput(e.target.value)} />

                <div className="flex gap-3">
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded flex-1 hover:bg-green-600 font-bold shadow-md">Mentés</button>
                    <button onClick={() => setEditMode(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex-1 hover:bg-gray-400 shadow-md">Mégse</button>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
                <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100 shadow-sm hover:shadow-md transition">
                    <p className="text-3xl font-extrabold text-purple-600">{profile.completedDatesCount}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold mt-1">Kész Randik</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-xl text-center border border-pink-100 shadow-sm hover:shadow-md transition">
                    <p className="text-3xl font-extrabold text-pink-600">{stats.next}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold mt-1">Nap az évfordulóig</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center cursor-pointer hover:bg-yellow-100 transition border border-yellow-100 shadow-sm hover:shadow-md" onClick={() => navigator.clipboard.writeText(profile.coupleCode)}>
                    <p className="text-xl font-mono font-bold text-yellow-700">{profile.coupleCode}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold mt-1">Kód másolása 📋</p>
                </div>
            </div>
        )}

        {!editMode && (
            <div className="flex gap-4 justify-center items-center mt-4">
                <button onClick={() => setEditMode(true)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-3 py-1 rounded hover:bg-blue-50 transition">
                    ✏️ Adatok módosítása
                </button>
                <span className="text-gray-300">|</span>
                <button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }} className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded hover:bg-red-50 transition">
                    Kijelentkezés
                </button>
            </div>
        )}
    </div>
  );
}

