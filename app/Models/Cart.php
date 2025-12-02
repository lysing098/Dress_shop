<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'user_cart';
    protected $fillable = ['user_id', 'product_id', 'quantity'];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
