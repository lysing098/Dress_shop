import React from "react";
import RootLayout from "@/Layouts/RootLayout";
import { router } from "@inertiajs/react";

export default function Cart({ cart }) {
    const handleUpdate = (id, quantity) => {
        router.put(route("cart.update", id), { quantity });
    };

    const handleDelete = (id) => {
        router.delete(route("cart.destroy", id));
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-3xl text-center font-bold mb-6">Shopping Cart</h1>

            {cart.length === 0 && (
                <p className="text-gray-500 text-center py-20 text-xl">
                    Your cart is empty 😔
                </p>
            )}

            <div className="space-y-4">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-white"
                    >
                        {/* Product Image */}
                        <img
                            src={`/storage/${item.product.image_path}`}
                            className="w-24 h-24 object-cover rounded"
                        />

                        {/* Product Detail */}
                        <div className="flex-1">
                            <p className="text-lg font-semibold">{item.product.name}</p>
                            <p className="text-pink-500 font-bold">
                                $ {item.product.price}
                            </p>
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <input
                                type="number"
                                className="w-20 border rounded px-2 py-1"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdate(item.id, e.target.value)}
                            />
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

Cart.layout = (page) => <RootLayout>{page}</RootLayout>;
