import { useState, useMemo } from 'react'; 
import { Wheel } from 'react-custom-roulette';

export default function DateWheel({ dates }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [filterTags, setFilterTags] = useState([]);

  
  
  
  const availableFilters = useMemo(() => {
    const allTags = dates.flatMap(d => d.tags || []); 
    return [...new Set(allTags)].sort(); 
  }, [dates]);

  
  const filteredDates = dates.filter(date => {
    if (filterTags.length === 0) return true;
    
    return filterTags.some(tag => date.tags && date.tags.includes(tag));
  });

  const toggleFilter = (tag) => {
    if (filterTags.includes(tag)) setFilterTags(filterTags.filter(t => t !== tag));
    else setFilterTags([...filterTags, tag]);
  };

  const data = filteredDates.map((d, index) => ({
    option: d.title.length > 15 ? d.title.substring(0, 15) + '...' : d.title,
    style: { backgroundColor: index % 2 === 0 ? '#ff7eb3' : '#7afcff', textColor: 'black' }
  }));

  const handleSpinClick = () => {
    if (!mustSpin && data.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="flex flex-col items-center py-5 w-full">
      <h2 className="text-2xl font-bold mb-2 text-purple-700">🎡 Pörgetés</h2>

      {}
      <div className="mb-4 w-full max-w-md">
          <p className="text-xs text-center text-gray-400 mb-1">Szűrés címkékre:</p>
          <div className="flex flex-wrap justify-center gap-2 max-h-24 overflow-y-auto p-1 scrollbar-hide">
            {availableFilters.map(tag => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`text-[10px] px-2 py-1 rounded-full border transition ${filterTags.includes(tag) ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
              >
                {tag}
              </button>
            ))}
          </div>
      </div>

      {filteredDates.length === 0 ? (
        <p className="text-red-500 text-sm mt-4">Nincs találat ilyen szűréssel!</p>
      ) : (
        <>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            backgroundColors={['#3e3e3e', '#df3428']}
            textColors={['#ffffff']}
            onStopSpinning={() => {
              setMustSpin(false);
              alert(`A nyertes: ${filteredDates[prizeNumber].title}!`);
            }}
          />
          <button
            onClick={handleSpinClick}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            PÖRGETÉS!
          </button>
        </>
      )}
    </div>
  );
}

