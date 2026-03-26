import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f6f3ed] dark:bg-stone-900 w-full pt-20 pb-10 mt-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-12 max-w-7xl mx-auto font-['Inter'] text-sm leading-relaxed">
        <div className="col-span-2 md:col-span-1">
          <span className="font-['Manrope'] text-xl font-bold text-[#750005] mb-6 block uppercase">Heritage Hearth</span>
          <p className="text-slate-500 dark:text-stone-400 mb-6">
            Preserving the soul of Nepalese craftsmanship through modern editorial commerce.
          </p>
          <div className="flex gap-4 text-[#750005]">
            <span className="material-symbols-outlined">public</span>
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="material-symbols-outlined">eco</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-headline font-bold text-on-surface uppercase tracking-widest text-xs mb-2">Collections</h4>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Ceramics</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Textiles</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Woodwork</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Metalware</a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-headline font-bold text-on-surface uppercase tracking-widest text-xs mb-2">Heritage</h4>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Our Heritage</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Sustainability</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">The Journal</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Artisan Stories</a>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-headline font-bold text-on-surface uppercase tracking-widest text-xs mb-2">Support</h4>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Shipping & Returns</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Contact</a>
          <a className="text-slate-500 dark:text-stone-400 hover:underline decoration-[#750005] underline-offset-4 transition-opacity" href="#">Privacy Policy</a>
        </div>
      </div>
      <div className="mt-16 px-12 max-w-7xl mx-auto border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-xs uppercase tracking-widest">© 2024 Heritage Hearth. Curating Nepali Craftsmanship.</p>
        <div className="flex gap-8 text-xs font-label uppercase tracking-widest text-secondary">
          <span>Kathmandu</span>
          <span>London</span>
          <span>New York</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
