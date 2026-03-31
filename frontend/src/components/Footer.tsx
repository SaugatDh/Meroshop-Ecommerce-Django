import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#f6f3ed] border-t border-[#e3beb9]/15 mt-24">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 w-full px-8 py-12 max-w-7xl mx-auto">
        <div className="col-span-2">
          <p className="text-xl font-bold text-[#585f65] mb-6">MeroShop</p>
          <p className="font-inter text-xs leading-relaxed text-[#585f65] max-w-xs mb-6">
            Authentically curated, locally sourced. Bringing the soul of Nepal to the world through high-end artisanal craftsmanship.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-secondary opacity-80 hover:opacity-100 transition-all cursor-pointer">public</span>
            <span className="material-symbols-outlined text-secondary opacity-80 hover:opacity-100 transition-all cursor-pointer">camera</span>
            <span className="material-symbols-outlined text-secondary opacity-80 hover:opacity-100 transition-all cursor-pointer">send</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-xs uppercase tracking-widest text-primary">Explore</p>
          <button 
            onClick={() => onNavigate?.('shop')}
            className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left"
          >
            About Us
          </button>
          <button 
            onClick={() => onNavigate?.('shop')}
            className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left"
          >
            Flash Sale
          </button>
          <button 
            onClick={() => onNavigate?.('shop')}
            className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left"
          >
            Global Collection
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-xs uppercase tracking-widest text-primary">Legal</p>
          <button className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left">Terms & Conditions</button>
          <button className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left">Privacy Policy</button>
          <button className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left">Returns & Refunds</button>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-xs uppercase tracking-widest text-primary">Support</p>
          <button className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left">Help Center</button>
          <button className="font-inter text-xs leading-relaxed text-[#585f65] hover:underline hover:text-[#750005] transition-all opacity-80 hover:opacity-100 text-left">Contact Us</button>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-xs uppercase tracking-widest text-primary">App</p>
          <div className="bg-black text-white p-2 rounded flex items-center gap-2 cursor-pointer w-fit">
            <span className="material-symbols-outlined text-sm">phone_iphone</span>
            <span className="text-[10px]">App Store</span>
          </div>
          <div className="bg-black text-white p-2 rounded flex items-center gap-2 cursor-pointer w-fit">
            <span className="material-symbols-outlined text-sm">play_arrow</span>
            <span className="text-[10px]">Play Store</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-6 border-t border-outline-variant/10 text-center">
        <p className="font-inter text-xs leading-relaxed text-[#585f65]">© 2024 MeroShop. Crafted with Nepali Soul.</p>
      </div>
    </footer>
  );
};
