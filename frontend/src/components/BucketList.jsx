import { useState, useEffect } from 'react';
import api from '../api';

export default function BucketList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await api.get('/bucketlist');
      setItems(res.data);
    } catch (err) { console.error("Hiba", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const add = async () => {
    if (!newItem.trim()) return;
    setLoading(true);
    try {
      // Küldjük a címet
      await api.post('/bucketlist', { title: newItem });
      setNewItem('');
      await fetchItems();
    } catch (err) {
      alert("Hiba a hozzáadáskor!");
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
    await api.put(`/bucketlist/${id}/toggle`);
    fetchItems();
  };

  const remove = async (id) => {
    if(!window.confirm("Biztosan törlöd?")) return;
    await api.delete(`/bucketlist/${id}`);
    fetchItems();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 sticky top-0 bg-white z-10">📝 Közös Bakancslista</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border-2 border-blue-100 p-2 rounded w-full focus:outline-none focus:border-blue-500 transition"
          placeholder="Pl. Eljutni Párizsba..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button
          onClick={add}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
        >
          +
        </button>
      </div>

      <ul className="space-y-2 overflow-y-auto flex-1 pr-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition rounded group">

            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggle(item.id)}>
              {/* Pipa */}
              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {item.completed && <span className="text-white text-xs">✓</span>}
              </div>

              {/* Szöveg és Név */}
              <div className="flex flex-col">
                  <span className={`text-md ${item.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {item.title}
                  </span>
                  {/* ITT ÍRJUK KI A NEVET: */}
                  <span className="text-[10px] text-gray-400 uppercase font-bold">
                    {item.createdByName || "Ismeretlen"}
                  </span>
              </div>
            </div>

            <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition">
              🗑️
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 mt-10 text-sm">Még üres a lista.</p>}
      </ul>
    </div>
  );
}