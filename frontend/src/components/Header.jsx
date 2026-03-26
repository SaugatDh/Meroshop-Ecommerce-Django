import React from 'react';

const Header = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fcf9f3] dark:bg-stone-950 opacity-80 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto font-['Manrope'] antialiased tracking-tight">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-bold tracking-tighter text-[#750005] dark:text-[#9e0b0e] uppercase cursor-pointer">HERITAGE HEARTH</span>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-[#750005] dark:text-[#9e0b0e] border-b-2 border-[#750005] pb-1 font-medium transition-colors duration-300" href="#">Shop</a>
            <a className="text-slate-600 dark:text-stone-400 font-medium hover:text-[#750005] transition-colors duration-300" href="#">Artisans</a>
            <a className="text-slate-600 dark:text-stone-400 font-medium hover:text-[#750005] transition-colors duration-300" href="#">Our Story</a>
            <a className="text-slate-600 dark:text-stone-400 font-medium hover:text-[#750005] transition-colors duration-300" href="#">Journal</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <input className="bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg pl-10 pr-4 py-2 text-sm w-64 transition-all duration-300 outline-none" type="text" placeholder="Search..."/>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-[#750005] hover:scale-95 duration-200 ease-in-out">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
            <button className="text-[#750005] hover:scale-95 duration-200 ease-in-out">
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
