<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Heritage Hearth - Curating Nepali Craftsmanship</title>

    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-surface text-on-surface font-body antialiased">
    @include('home.header')

    <main class="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
        <header class="mb-12">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <nav class="flex items-center gap-2 text-xs font-label tracking-widest text-secondary uppercase mb-4">
                        <span>Shop</span>
                        <span class="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span class="text-primary font-bold">Collections</span>
                    </nav>
                    <h1 class="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">Our Crafts</h1>
                    <p class="text-secondary font-body italic">Exquisite handmade pieces from the heart of Nepal</p>
                </div>
                <div class="flex items-center gap-4 border-b border-outline-variant pb-2">
                    <span class="text-xs font-label uppercase tracking-widest text-secondary">Sort By</span>
                    <select class="bg-transparent border-none focus:ring-0 text-sm font-semibold cursor-pointer">
                        <option>Recommended</option>
                        <option>Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>
        </header>

        <div class="flex flex-col lg:flex-row gap-16">
            <aside class="w-full lg:w-64 flex-shrink-0 space-y-10">
                <div>
                    <h3 class="font-headline font-bold text-lg mb-6 border-b border-outline-variant pb-2">Category</h3>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input checked="" class="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                            <span class="text-sm font-body text-on-surface group-hover:text-primary transition-colors">All Collections</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input class="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                            <span class="text-sm font-body text-on-surface group-hover:text-primary transition-colors">Textiles</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <input class="rounded-sm border-secondary text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                            <span class="text-sm font-body text-on-surface group-hover:text-primary transition-colors">Ceramics</span>
                        </label>
                    </div>
                </div>
                <div>
                    <h3 class="font-headline font-bold text-lg mb-6 border-b border-outline-variant pb-2">Price Range</h3>
                    <div class="space-y-4">
                        <input class="w-full accent-primary bg-surface-container-high h-1 rounded-full appearance-none" type="range"/>
                        <div class="flex justify-between items-center">
                            <span class="text-xs font-label text-secondary">$50</span>
                            <span class="text-xs font-label text-secondary">$1,200</span>
                        </div>
                    </div>
                </div>
            </aside>

            @include('home.product')
        </div>
    </main>

    @include('home.footer')

    <script>
        document.addEventListener("DOMContentLoaded", function(event) { 
            var scrollpos = localStorage.getItem('scrollpos');
            if (scrollpos) window.scrollTo(0, scrollpos);
        });

        window.onbeforeunload = function(e) {
            localStorage.setItem('scrollpos', window.scrollY);
        };
    </script>
</body>
</html>
