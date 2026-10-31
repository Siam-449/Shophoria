import React from 'react';
import { SearchIcon } from './icons/SearchIcon.jsx';

const SearchBar = ({ 
  isMobile = false,
  searchQuery,
  onSearchChange,
  onSearchFocus,
  onSearchSubmit,
  isFocused,
  searchResults,
  onItemClick
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <span className={`absolute inset-y-0 left-0 flex items-center ${isMobile ? 'pl-5' : 'pl-3'}`}>
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </span>
        <input
          type="search"
          name="search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={onSearchChange}
          onFocus={onSearchFocus}
          autoComplete="off"
          className="w-full py-2 pl-10 pr-20 text-sm bg-white dark:bg-[#0d0c0b] text-slate-900 dark:text-slate-100 focus:outline-none rounded-l-full [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          className="bg-black dark:bg-[#1c1b1a] dark:border dark:border-neutral-700 text-white px-5 py-2 text-sm font-medium rounded-r-full hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </form>
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#0d0c0b] border border-slate-300 dark:border-neutral-800 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
          <ul>
            {searchResults.length > 0 ? (
              <>
                {searchResults.map(product => (
                  <li key={product.id}>
                    <button 
                      onClick={() => onItemClick(`/products/${product.slug}`)} 
                      className="flex items-center gap-4 p-3 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors w-full text-left"
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{product.name}</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">৳{product.price.toLocaleString()}</p>
                      </div>
                    </button>
                  </li>
                ))}
                <li className="p-2 border-t border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={handleSubmit} 
                    className="text-center text-sm font-semibold text-black dark:text-white hover:underline w-full py-1"
                  >
                    View all results
                  </button>
                </li>
              </>
            ) : (
                <li className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">No products found.</li>
             )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
