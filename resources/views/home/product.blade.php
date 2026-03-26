<div class="flex-grow">
    @if(session()->has('message'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8" role="alert">
            <span class="block sm:inline">{{session()->get('message')}}</span>
        </div>
    @endif

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
        @foreach($product as $products)
            <div class="group cursor-pointer">
                <div class="relative overflow-hidden mb-6 aspect-[4/5] bg-surface-container-low">
                    <img class="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-700" src="product/{{$products->image}}" alt="{{$products->title}}"/>
                    <div class="absolute top-4 left-4">
                        @if($products->discount!=null)
                            <span class="bg-surface/90 backdrop-blur px-3 py-1 text-[10px] font-label uppercase tracking-widest text-primary font-bold rounded-sm">Special Offer</span>
                        @else
                            <span class="bg-surface/90 backdrop-blur px-3 py-1 text-[10px] font-label uppercase tracking-widest text-primary font-bold rounded-sm">{{$products->category}}</span>
                        @endif
                    </div>
                    <form action="{{url('add_cart',$products->id)}}" method="Post" class="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        @csrf
                        <input type="hidden" name="quantity" value="1">
                        <button type="submit" class="bg-surface text-primary p-3 rounded-full shadow-lg">
                            <span class="material-symbols-outlined">shopping_cart</span>
                        </button>
                    </form>
                </div>
                <div class="space-y-2">
                    <div class="flex justify-between items-start">
                        <a href="{{url('product_details',$products->id)}}">
                            <h4 class="font-headline font-bold text-xl group-hover:text-primary transition-colors">{{$products->title}}</h4>
                        </a>
                        <div class="flex items-center gap-1 text-primary">
                            <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="text-xs font-bold">4.9</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 bg-surface-variant px-2 py-1 rounded-sm">
                            <span class="text-[10px] font-label uppercase tracking-tighter">Handcrafted</span>
                        </div>
                    </div>
                    <div class="flex items-baseline gap-2">
                        @if($products->discount!=null)
                            <p class="text-2xl font-headline font-extrabold text-on-surface">${{$products->discount}}</p>
                            <p class="text-sm font-headline font-medium text-secondary line-through">${{$products->price}}</p>
                        @else
                            <p class="text-2xl font-headline font-extrabold text-on-surface">${{$products->price}}</p>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
    <div class="mt-20 flex justify-center">
        {!!$product->withQueryString()->links('pagination::tailwind')!!}
    </div>
</div>
