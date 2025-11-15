import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';

// --- MOCK DATA ---
const products = [
  { id: 101, name: 'UNO Flip Card (New Edition)', price: 180, image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_pad,b_auto,w_500,h_500,f_auto,q_auto/v1759251724/UNOFLIPCARDNEWEDITION_fnkosz.jpg', category: 'Home & Toys' },
  { id: 201, name: 'Trendy Cartoon Kitty Handbag', price: 300, image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_pad,b_auto,w_500,h_500,f_auto,q_auto/v1759251677/fashion-handbag-1_nisjdn.jpg', category: 'Fashion & Beauty' },
  { id: 301, name: 'BTS Note Pad', price: 56, image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_pad,b_auto,w_500,h_500,f_auto,q_auto/v1759251670/bts-note-pad-small_v1t7sb.jpg', category: 'Books & Paints' },
  { id: 427, name: 'Basic Electricity Project Kit', price: 249, image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_pad,b_auto,w_500,h_500,f_auto,q_auto/v1759251669/basic-electricity-project-kit_zdsozh.jpg', category: 'Electronics' },
  { id: 102, name: 'Black UNO Card', price: 99, image: 'https://res.cloudinary.com/dqki5wiei/image/upload/c_pad,b_auto,w_500,h_500,f_auto,q_auto/v1759251668/BLACKUNOCARD_t9ikjg.jpg', category: 'Home & Toys' },
];

// --- MOCK HOOKS & CONTEXT (to replicate Next.js environment) ---
// Theme Context
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);
const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme) => setThemeState(newTheme);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// Cart Context
const CartContext = createContext(null);
const useCart = () => useContext(CartContext);
const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([{...products[0], quantity: 1}]);
    const toggleCart = () => alert('Cart toggled!');
    return <CartContext.Provider value={{ cartItems, toggleCart }}>{children}</CartContext.Provider>;
}

// Products Context
const ProductsContext = createContext(null);
const useProducts = () => useContext(ProductsContext);
const ProductsProvider = ({ children }) => {
    return <ProductsContext.Provider value={{ products }}>{children}</ProductsContext.Provider>;
}

// Routing Mocks
const usePathname = () => window.location.pathname;
const useRouter = () => ({ push: (path) => {
    alert(`Navigating to ${path}`);
    window.location.href = path; // Simple navigation
}});

// --- MOCK COMPONENTS (to replace Next.js components) ---
const Link = ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>;

// --- ICONS ---
const SearchIcon = ({ className = "h-6 w-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const MoonIcon = ({ className = "h-6 w-6", ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SunIcon = ({ className = "h-6 w-6", ...props }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const CartIcon = ({ className = "h-6 w-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
const MenuIcon = ({ className = "h-6 w-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const CloseIcon = ({ className = "h-6 w-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

// --- MAIN COMPONENTS ---
const SearchBar = ({ isMobile = false, searchQuery, onSearchChange, onSearchFocus, isFocused, searchResults, onItemClick }) => {
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="relative">
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
            {searchResults.length > 0 ? searchResults.map(product => (
              <li key={product.id}>
                <button 
                  onClick={() => onItemClick(`/products/${product.id}`)} 
                  className="flex items-center gap-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full text-left"
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{product.name}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">৳{product.price.toLocaleString()}</p>
                  </div>
                </button>
              </li>
            )) : (
                <li className="p-3 text-center text-sm text-slate-500 dark:text-slate-400">No products found.</li>
             )}
          </ul>
        </div>
      )}
    </>
  );
};


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleCart, cartItems } = useCart();
  const { products } = useProducts();
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => { setMounted(true) }, []);

  useEffect(() => {
    if (searchQuery.trim() === '' || !products || products.length === 0) {
      setSearchResults([]);
      return;
    }
    const lowerCaseQuery = searchQuery.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(lowerCaseQuery)).slice(0, 5);
    setSearchResults(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchContainerRef]);

  const handleSearchItemClick = (href) => {
    router.push(href);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };
  
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchFocused(e.target.value.trim() !== '');
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim()) setIsSearchFocused(true);
  }

  const navLinks = [
    { name: 'All Products', href: '#/products' },
    { name: 'Fashion & Beauty', href: '#/fashion' },
    { name: 'Electronics', href: '#/electronics' },
    { name: 'Home & Toys', href: '#/home-toy' },
    { name: 'Books & Paints', href: '#/books' },
    { name: 'Contact', href: '#/contact' },
  ];

  const renderThemeChanger = () => {
    if (!mounted) return null;
    return theme === 'dark' 
      ? <SunIcon className="h-6 w-6 cursor-pointer" onClick={() => setTheme('light')} /> 
      : <MoonIcon className="h-6 w-6 cursor-pointer" onClick={() => setTheme('dark')} />;
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="#/" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SHOPHORIA
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href.substring(1);
                return (
                    <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                        isActive
                        ? 'text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                    >
                    {link.name}
                    </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative" ref={!isMobileMenuOpen ? searchContainerRef : null}>
                <SearchBar 
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchInputChange}
                    onSearchFocus={handleSearchFocus}
                    isFocused={isSearchFocused}
                    searchResults={searchResults}
                    onItemClick={handleSearchItemClick}
                />
            </div>
            <button aria-label="Toggle theme" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              {renderThemeChanger()}
            </button>
            <button onClick={toggleCart} aria-label="Open cart" className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <CartIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div 
        id="mobile-menu" 
        className={`lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="relative p-2" ref={isMobileMenuOpen ? searchContainerRef : null}>
            <SearchBar 
                isMobile={true} 
                searchQuery={searchQuery}
                onSearchChange={handleSearchInputChange}
                onSearchFocus={handleSearchFocus}
                isFocused={isSearchFocused}
                searchResults={searchResults}
                onItemClick={handleSearchItemClick}
            />
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href.substring(1);
            return (
                <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
                >
                {link.name}
                </Link>
            );
          })}
            <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 flex justify-around items-center">
              <button aria-label="Toggle theme" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  {renderThemeChanger()}
              </button>
              <button onClick={() => { toggleCart(); setIsMobileMenuOpen(false); }} aria-label="Open cart" className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                  <CartIcon className="h-6 w-6" />
                   {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
              </button>  
            </div>
        </div>
      </div>
    </header>
  );
};

const App = () => (
    <ThemeProvider>
        <ProductsProvider>
            <CartProvider>
                <Navbar />
                <div className="p-8 text-center text-slate-700 dark:text-slate-300">
                    <h1 className="text-2xl font-bold">Navbar Component Preview</h1>
                    <p className="mt-2">The main application content would be displayed here.</p>
                </div>
            </CartProvider>
        </ProductsProvider>
    </ThemeProvider>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
