<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Actions\RedirectAfterLogin;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{

    public const HOME = '/dashboard';
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        
        Inertia::share([
        'cart' => function () {
            if (auth()->check()) {
                return Cart::where('user_id', auth()->id())
                    ->select('id','quantity')
                    ->get();
            }
            return [];
        },
    ]);
    }
}
