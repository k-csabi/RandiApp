import { useState, useMemo } from 'react';
import api from '../api';

export default function DateList({ dates, refreshDates }) {
  const [newDate, setNewDate] = useState({ title: '', description: '' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [listFilterTags, setListFilterTags] = useState([]);
  const [completingDate, setCompletingDate] = useState(null);
  const [rating, setRating] = useState(5);
  const [note, setNote] = useState('');

  const defaultTags = ["BELTÉRI", "KÜLTÉRI", "INGYENES", "FIZETŐS", "ROMANTIKUS", "AKTÍV"];

  
  const allExistingTags = useMemo(() => {
      const tags = dates.flatMap(d => d.tags || []);
      return [...new Set([...defaultTags, ...tags])].sort();
  }, [dates]);

  const visibleDates = dates.filter(date => {
      if (listFilterTags.length === 0) return true;
      return listFilterTags.every(tag => date.tags && date.tags.includes(tag));
  });

  const toggleListFilter = (tag) => {
      if (listFilterTags.includes(tag)) setListFilterTags(listFilterTags.filter(t => t !== tag));
      else setListFilterTags([...listFilterTags, tag]);
  };

  const startEditing = (date) => {
    setEditingId(date.id);
    setFormData({ title: date.title, description: date.description });
    setSelectedTags(date.tags || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewDate({ title: '', description: '' }); 
    setSelectedTags([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = editingId ? formData : newDate; 
    if (!dataToSubmit.title) return;

    let finalTags = [...selectedTags];
    if (!finalTags.includes('SAJÁT')) finalTags.push('SAJÁT');

    try {
      if (editingId) {
        await api.put(`/dates/${editingId}`, { ...formData, tags: finalTags });
        alert("Sikeres módosítás!");
      } else {
        await api.post('/dates', { ...newDate, tags: finalTags });
      }
      cancelEdit();
      refreshDates();
    } catch (err) { alert('Hiba a mentéskor!'); }
  };

  
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleDelete = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd?")) return;
    try { await api.delete(`/dates/${id}`); refreshDates(); }
    catch (err) { alert("Hiba törléskor"); }
  };

  const handleCompleteSubmit = async () => {
    try {
      await api.post('/journal', { dateIdeaId: completingDate.id, rating, note });
      alert("Naplózva! 🎉"); setCompletingDate(null); setNote(''); refreshDates();
    } catch (err) { alert("Hiba"); }
  };

  const toggleFormTag = (tag) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
    else setSelectedTags([...selectedTags, tag]);
  };

  const addCustomTag = (e) => {
      e.preventDefault();
      if (customTag.trim() && !selectedTags.includes(customTag.toUpperCase())) {
          setSelectedTags([...selectedTags, customTag.toUpperCase()]); setCustomTag('');
      }
  };

  return (
    <div className="space-y-6 pb-20"> {}

      {}
      <div className={`p-4 rounded-xl border-2 transition-all shadow-sm ${editingId ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : 'bg-white border-gray-200'}`}>
        <h3 className="text-sm font-bold mb-3 text-gray-700 uppercase tracking-wide flex items-center gap-2">
            {editingId ? '✏️ Szerkesztés alatt...' : '➕ Új ötlet felvétele'}
        </h3>

        <div className="flex gap-2 mb-3">
            <input
                className="border p-2 rounded-lg flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                placeholder="Cím (pl. Séta)"
                value={editingId ? formData.title : newDate.title}
                onChange={e => editingId ? setFormData({...formData, title: e.target.value}) : setNewDate({...newDate, title: e.target.value})}
            />
            {editingId ? (
                <div className="flex gap-1">
                    <button onClick={handleSubmit} className="bg-yellow-500 text-white px-3 rounded-lg font-bold text-sm shadow hover:bg-yellow-600">Mentés</button>
                    <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 rounded-lg font-bold text-sm shadow hover:bg-gray-500">Mégse</button>
                </div>
            ) : (
                <button onClick={handleSubmit} className="bg-green-600 text-white px-4 rounded-lg font-bold text-xl shadow hover:bg-green-700 transition">+</button>
            )}
        </div>

        <textarea
            className="border p-2 rounded-lg w-full mb-3 text-xs h-16 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            placeholder="Rövid leírás..."
            value={editingId ? formData.description : newDate.description}
            onChange={e => editingId ? setFormData({...formData, description: e.target.value}) : setNewDate({...newDate, description: e.target.value})}
        />

        {}
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2"> {}
                {defaultTags.map(tag => (
                <button key={tag} onClick={() => toggleFormTag(tag)} className={`text-[10px] px-2 py-1 rounded-md border transition ${selectedTags.includes(tag) ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>{tag}</button>
                ))}
            </div>
            <div className="flex gap-2 mt-1">
                <input className="border p-1 text-xs rounded flex-1" placeholder="Saját címke..." value={customTag} onChange={e => setCustomTag(e.target.value)} />
                <button onClick={addCustomTag} className="bg-gray-200 text-gray-600 text-xs px-3 rounded font-bold border border-gray-300">+</button>
            </div>
            {selectedTags.length > 0 && <div className="text-[10px] text-purple-600 font-bold mt-1">Kiválasztva: {selectedTags.join(", ")}</div>}
        </div>
      </div>

      {}
      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm sticky top-0 z-10">
          <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">Szűrés címkékre:</p>
          {}
          <div className="flex flex-wrap gap-2">
              {allExistingTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleListFilter(tag)}
                    className={`text-[10px] px-2 py-1 rounded-full border transition ${listFilterTags.includes(tag) ? 'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                  >
                    {tag}
                  </button>
              ))}
          </div>
          {listFilterTags.length > 0 && (
              <div className="flex justify-between items-center mt-2 border-t pt-2">
                  <span className="text-xs text-blue-600 font-bold">Aktív: {listFilterTags.join(", ")}</span>
                  <button onClick={() => setListFilterTags([])} className="text-xs text-red-400 hover:text-red-600 font-bold">X Törlés</button>
              </div>
          )}
      </div>

      {}
      <div className="space-y-3">
        {visibleDates.map((date) => (
          <div key={date.id} className={`group relative p-4 rounded-xl shadow-sm border transition-all duration-300 ${editingId === date.id ? 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-100' : 'bg-white border-gray-100 hover:shadow-md hover:border-purple-200'}`}>

            {}
            <div className="flex justify-between items-start gap-3">

                {}
                <div className="flex-1 min-w-0"> {}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-bold text-gray-800 text-sm">{date.title}</h4>
                        {date.isOwn && <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold border border-yellow-200">SAJÁT</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 italic break-words">{date.description || "Nincs leírás."}</p>
                    <div className="flex flex-wrap gap-1">
                        {date.tags && date.tags.map(tag => (
                            <span key={tag} className={`text-[9px] px-2 py-0.5 rounded border ${tag === 'SAJÁT' ? 'hidden' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {}
                <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => setCompletingDate(date)} className="w-8 h-8 rounded-full bg-green-50 border border-green-200 text-green-600 hover:bg-green-500 hover:text-white flex items-center justify-center transition shadow-sm" title="Kész">✓</button>

                    <button onClick={() => startEditing(date)} className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition shadow-sm" title="Szerkesztés">✏️</button>

                    <button onClick={() => handleDelete(date.id)} className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition shadow-sm opacity-60 group-hover:opacity-100" title="Törlés">🗑️</button>
                </div>
            </div>
          </div>
        ))}
        {visibleDates.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <p className="text-4xl mb-2">📭</p>
                <p className="text-sm">Nincs találat.</p>
            </div>
        )}
      </div>

      {}
      {completingDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all scale-100">
                <h3 className="text-lg font-bold mb-4 text-center text-gray-800">Randi lezárása 🥂</h3>
                <div className="flex justify-center gap-2 mb-6 text-3xl">
                    {[1,2,3,4,5].map(star => (<button key={star} onClick={() => setRating(star)} className={`transition ${star <= rating ? "text-yellow-400 scale-110" : "text-gray-200 hover:text-gray-300"}`}>★</button>))}
                </div>
                <textarea className="w-full border-2 border-gray-100 p-3 rounded-xl mb-6 h-24 text-sm focus:border-purple-300 focus:outline-none transition" placeholder="Élménybeszámoló..." value={note} onChange={e => setNote(e.target.value)} />
                <div className="flex gap-3">
                    <button onClick={() => setCompletingDate(null)} className="flex-1 bg-gray-100 p-2 rounded-xl text-gray-600 font-bold hover:bg-gray-200 transition">Mégse</button>
                    <button onClick={handleCompleteSubmit} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-xl font-bold hover:shadow-lg transition">Mentés</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

