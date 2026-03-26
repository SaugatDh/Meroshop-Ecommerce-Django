<nav class="fixed top-0 w-full z-50 bg-[#fcf9f3] dark:bg-stone-950 opacity-80 backdrop-blur-md">
    <div class="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto font-['Manrope'] antialiased tracking-tight">
        <div class="flex items-center gap-12">
            <a href="{{url('/')}}" class="text-2xl font-bold tracking-tighter text-[#750005] dark:text-[#9e0b0e] uppercase">HERITAGE HEARTH</a>
            <div class="hidden md:flex items-center space-x-8">
                <a class="text-[#750005] dark:text-[#9e0b0e] border-b-2 border-[#750005] pb-1 font-medium transition-colors duration-300" href="{{url('/')}}">Shop</a>
                <a class="text-slate-600 dark:text-stone-400 font-medium hover:text-[#750005] transition-colors duration-300" href="#">Artisans</a>
                <a class="text-slate-600 dark:text-stone-400 font-medium hover:text-[#750005] transition-colors duration-300" href="#">Our Story</a>
                <a class="text-slate-600 dark:text-stone-400 font-medium hover:text-[#750005] transition-colors duration-300" href="#">Journal</a>
            </div>
        </div>
        <div class="flex items-center gap-6">
            <div class="relative hidden lg:block">
                <form action="{{url('product_search')}}" method="get">
                    <input name="search" class="bg-surface-container-low border-none focus:ring-2 focus:ring-primary rounded-lg pl-10 pr-4 py-2 text-sm w-64 transition-all duration-300 outline-none" type="text" placeholder="Search..."/>
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
                </form>
            </div>
            <div class="flex items-center gap-4">
                <a href="{{url('show_cart')}}" class="text-[#750005] hover:scale-95 duration-200 ease-in-out">
                    <span class="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
                </a>
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/user/profile') }}" class="text-[#750005] hover:scale-95 duration-200 ease-in-out">
                            <span class="material-symbols-outlined" data-icon="person">person</span>
                        </a>
                        <form action="{{route('logout')}}" method="post" class="inline">
                            @csrf
                            <button type="submit" class="text-[#750005] hover:scale-95 duration-200 ease-in-out">
                                <span class="material-symbols-outlined">logout</span>
                            </button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="text-[#750005] hover:scale-95 duration-200 ease-in-out">
                            <span class="material-symbols-outlined">login</span>
                        </a>
                        <a href="{{ route('register') }}" class="text-[#750005] hover:scale-95 duration-200 ease-in-out">
                            <span class="material-symbols-outlined">person_add</span>
                        </a>
                    @endauth
                @endif
            </div>
        </div>
    </div>
</nav>
