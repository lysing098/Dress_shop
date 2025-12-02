<?php

use App\Http\Controllers\CarouselController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Models\Carousel;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
     $carousels = Carousel::orderBy('order')->get();
     $categories = Category::all();
     $products = Product::all();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'carousels' => $carousels,
        'categories' => $categories,
        'products' => $products,
    ]);
})->name('welcome');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/product/{product}', [ProductController::class,'show'])->name('product.show');

// AUTH CUSTOMER ROUTES
Route::middleware('auth')->group(function(){
    Route::resource('/cart', CartController::class);
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ADMIN ROUTES
Route::middleware(['auth','admin'])->group(function(){
    Route::get('/dashboard', function(){
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::resource('category', CategoryController::class);
    Route::resource('carousels', CarouselController::class);
    Route::resource('product', ProductController::class)->except(['show']);
});
require __DIR__.'/auth.php';
