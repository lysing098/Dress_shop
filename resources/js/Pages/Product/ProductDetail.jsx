import RootLayout from "@/Layouts/RootLayout";
import { router, usePage } from "@inertiajs/react";
import React from "react";

const ProductDetail = () => {
    const { product } = usePage().props;

    if (!product)
        return <p className="text-center mt-10">Product not found.</p>;

    return (
        <div className=" mt-20 px-4 md:px-0">
            <div className="flex  gap-10">
                {/* Product Image */}
                <div className="md:w-1/2 flex justify-center">
                    <img
                        src={`/storage/${product.image_path}`}
                        alt={product.name}
                        className="w-full h-[50%] object-contain "
                    />
                </div>

                {/* Product Details */}
                <div className="md:w-1/2 flex flex-col gap-6">
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <p className="text-2xl font-semibold text-pink-500">
                        $ {product.price}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        {product.description}
                    </p>

                    {/* Optional Buttons */}
                    <div className="flex gap-4 mt-4">
                        <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded transition duration-200"
                        onClick={()=>router.post(route('cart.store',{
                            product_id:product.id,
                            quantity:1
                        }))}
                        >
                            Add to Cart
                        </button>
                        <button className="border border-pink-500 hover:bg-pink-50 text-pink-500 font-semibold px-6 py-2 rounded transition duration-200">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductDetail.layout = (page) => <RootLayout>{page}</RootLayout>;

export default ProductDetail;
