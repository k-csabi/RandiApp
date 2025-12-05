import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Journal() {
  const [history, setHistory] = useState([]);
  const { user } = useContext(AuthContext);

  
  const [reactingTo, setReactingTo] = useState(null); 
  const [editingId, setEditingId] = useState(null);   

  const [rating, setRating] = useState(5);
  const [note, setNote] = useState('');

  const fetchHistory = () => {
    api.get('/journal').then(res => setHistory(res.data));
  };

  useEffect(() => { fetchHistory(); }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Mai nap";
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const splitNotes = (fullNote) => {
    if (!fullNote) return { note1: "", note2: "" };
    const parts = fullNote.split(" | Partner: ");
    return { note1: parts[0] || "", note2: parts[1] || "" };
  };

  
  const startEditing = (item, currentRating, currentNote) => {
      setReactingTo(item); 
      setEditingId(item.id); 
      setRating(currentRating);
      setNote(currentNote);
  };

  
  const handleSubmit = async () => {
    try {
      if (editingId) {
          
          await api.put(`/journal/${editingId}`, { rating, note });
          alert("Sikeres javítás!");
      } else {
          
          await api.post('/journal', { dateIdeaId: reactingTo.dateIdeaId, rating, note });
          alert("Szuper! A te véleményed is bekerült! ❤️");
      }
      setReactingTo(null);
      setEditingId(null);
      setNote('');
      fetchHistory();
    } catch (err) { alert("Hiba mentéskor"); }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">📖 Közös Napló</h2>

      <div className="space-y-6">
        {history.map(item => {
            const { note1, note2 } = splitNotes(item.note);
            const amIInitiator = user && user.name === item.user1Name;

            return (
              <div key={item.id} className="border border-purple-100 rounded-xl p-0 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="bg-purple-50 p-3 flex justify-between items-center border-b border-purple-100">
                    <h3 className="font-bold text-lg text-purple-800">{item.dateTitle}</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">{formatDate(item.completedAt)}</span>
                </div>

                <div className="flex divide-x divide-purple-100">
                    {}
                    <div className="flex-1 p-4 flex flex-col items-center text-center relative group">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">{item.user1Name}</p>
                        <div className="text-yellow-400 text-xl mb-2">{"★".repeat(item.ratingUser1 || 0)}{"☆".repeat(5 - (item.ratingUser1 || 0))}</div>
                        {note1 && <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic w-full text-left">{note1}</div>}

                        {}
                        {amIInitiator && (
                            <button onClick={() => startEditing(item, item.ratingUser1, note1)} className="absolute top-2 right-2 text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition">✏️</button>
                        )}
                    </div>

                    {}
                    <div className="flex-1 p-4 flex flex-col items-center text-center bg-gray-50/30 relative group">
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">{item.user2Name}</p>
                        {item.ratingUser2 ? (
                            <>
                                <div className="text-yellow-400 text-xl mb-2">{"★".repeat(item.ratingUser2)}{"☆".repeat(5 - item.ratingUser2)}</div>
                                {note2 && <div className="bg-white p-3 rounded-lg text-sm text-gray-600 italic w-full text-left">{note2}</div>}

                                {}
                                {!amIInitiator && (
                                    <button onClick={() => startEditing(item, item.ratingUser2, note2)} className="absolute top-2 right-2 text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition">✏️</button>
                                )}
                            </>
                        ) : (
                            !amIInitiator ? (
                                <button onClick={() => {setReactingTo(item); setEditingId(null); setRating(5); setNote('');}} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-4 py-2 rounded-full hover:scale-105 transition shadow-md font-bold">Értékeld te is!</button>
                            ) : (<div className="text-gray-400 text-sm italic">⏳ Még nem értékelte...</div>)
                        )}
                    </div>
                </div>
              </div>
            );
        })}
      </div>

      {}
      {reactingTo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all scale-100">
                <h3 className="text-xl font-bold mb-2 text-center text-gray-800">{editingId ? 'Szerkesztés' : 'Te mit gondolsz?'}</h3>
                <p className="text-sm text-gray-500 text-center mb-6">Erről: <span className="font-bold text-purple-600">{reactingTo.dateTitle}</span></p>

                <div className="flex justify-center gap-2 mb-6 text-3xl">
                    {[1,2,3,4,5].map(star => (<button key={star} onClick={() => setRating(star)} className={`transition ${star <= rating ? "text-yellow-400 scale-110" : "text-gray-200 hover:text-gray-300"}`}>★</button>))}
                </div>
                <textarea className="w-full border-2 border-gray-100 p-3 rounded-xl mb-6 h-24 text-sm focus:border-purple-300 focus:outline-none transition" placeholder="Vélemény..." value={note} onChange={e => setNote(e.target.value)} />
                <div className="flex gap-3">
                    <button onClick={() => {setReactingTo(null); setEditingId(null);}} className="flex-1 bg-gray-100 p-3 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition">Mégse</button>
                    <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-bold hover:shadow-lg transition">Mentés</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

