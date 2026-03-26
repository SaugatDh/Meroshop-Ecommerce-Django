import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';

function App() {
  return (
    <div className="bg-surface text-on-surface font-body antialiased min-h-screen">
      <Header />

      <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-xs font-label tracking-widest text-secondary uppercase mb-4">
                <span>Shop</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary font-bold">Collections</span>
              </nav>
              <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Our Crafts</h1>
              <p className="text-secondary font-body italic">Exquisite handmade pieces from the heart of Nepal</p>
            </div>
            <div className="flex items-center gap-4 border-b border-outline-variant pb-2">
              <span className="text-xs font-label uppercase tracking-widest text-secondary">Sort By</span>
              <select className="bg-transparent border-none focus:ring-0 text-sm font-semibold cursor-pointer outline-none">
                <option>Recommended</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="font-headline font-bold text-lg mb-6 border-b border-outline-variant pb-2">Category</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                  <span className="text-sm font-body text-on-surface group-hover:text-primary transition-colors">All Collections</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                  <span className="text-sm font-body text-on-surface group-hover:text-primary transition-colors">Textiles</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                  <span className="text-sm font-body text-on-surface group-hover:text-primary transition-colors">Ceramics</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg mb-6 border-b border-outline-variant pb-2">Price Range</h3>
              <div className="space-y-4">
                <input className="w-full accent-primary bg-surface-container-high h-1 rounded-full appearance-none cursor-pointer" type="range"/>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-label text-secondary">$50</span>
                  <span className="text-xs font-label text-secondary">$1,200</span>
                </div>
              </div>
            </div>
          </aside>

          <ProductGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
