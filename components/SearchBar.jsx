
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
    <>
      <form onSubmit={handleSubmit} className="relative">
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
          className={`w-full py-2 pl-10 pr-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isMobile && 'w-56 lg:w-64 transition-all'}`}
        />
      </form>
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
          <ul>
            {searchResults.length > 0 ? (
              <>
                {searchResults.map(product => (
                  <li key={product.id}>
                    <button 
                      onClick={() => onItemClick(`/products/${product.slug}`)} 
                      className="flex items-center gap-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
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
                    className="text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline w-full py-1"
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
    </>
  );
};

export default SearchBar;
