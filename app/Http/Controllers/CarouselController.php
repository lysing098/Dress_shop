<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CarouselController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $carousels = Carousel::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Carousel/Index', [
            'carousels' => $carousels,
            'filters' => $request->only('search'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:carousels,name',
            'image_path' => 'required|image|max:2048',
            'order' => 'required|integer|unique:carousels,order',
        ]);

        // Handle file upload
        if ($request->hasFile('image_path')) {
            $path = $request->file('image_path')->store('carousels', 'public');
        }


        Carousel::create([
            'name' => $request->name,
            'image_path' => $path,
            'order' => $request->order,
        ]);

        return redirect()->route('carousels.index')->with('success', 'Carousel item created successfully.');


    }

    /**
     * Display the specified resource.
     */
    public function show(Carousel $carousel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Carousel $carousel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Carousel $carousel)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:carousels,name,' . $carousel->id,
            'image_path' => 'nullable|image|max:2048',
            'order' => 'required|integer|unique:carousels,order,' . $carousel->id,
        ]);

        // Handle file upload
        if ($request->hasFile('image_path')) {
            if($carousel->image_path && Storage::disk('public')->exists($carousel->image_path)) {
                // Optionally delete the old image file here
                Storage::disk('public')->delete($carousel->image_path);
            }
            $path = $request->file('image_path')->store('carousels', 'public');
            $carousel->image_path = $path;
        }

        $carousel->name = $request->name;
        $carousel->order = $request->order;
        $carousel->save();

        return redirect()->route('carousels.index')->with('success', 'Carousel item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Carousel $carousel)
    {
        if($carousel->image_path && Storage::disk('public')->exists($carousel->image_path)) {
            // Optionally delete the image file here
            Storage::disk('public')->delete($carousel->image_path);
        }
        $carousel->delete();
        return redirect()->route('carousels.index')->with('success', 'Carousel item deleted successfully.');
    }
}
