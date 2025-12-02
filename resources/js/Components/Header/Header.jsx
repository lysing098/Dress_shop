import { Link, usePage } from "@inertiajs/react";
import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoCart } from "react-icons/io5";

const Header = () => {
    const { auth, cart=[]} = usePage().props;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 w-full z-20 bg-white shadow-sm">
            <div className="container mx-auto py-4 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link href={route("welcome")}>
                    <h1 className="text-3xl font-bold tracking-wide text-gray-900">
                        Dress<span className="text-pink-500">.</span>
                    </h1>
                </Link>

                {/* Search Bar */}
                <div className="relative w-1/2 hidden md:block">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full rounded-full bg-gray-100 px-5 pl-12 py-2 border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                    <IoSearchSharp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                </div>

                {/* Cart + User */}
                <div className="flex items-center gap-6">
                    {/* Cart */}
                    <Link
                        href={route("cart.index")}
                        className="relative inline-block"
                    >
                        <IoCart size={28} />

                        {/* Badge */}
                        {totalQty > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                   rounded-full px-2 py-[1px] font-bold shadow"
                            >
                                {totalQty}
                            </span>
                        )}
                    </Link>

                    {/* Auth */}
                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            auth.user.role === "admin" ? (
                                <Link
                                    href={route("dashboard")}
                                    className="text-gray-800 hover:text-pink-500 font-medium duration-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <span className="font-medium text-gray-700">
                                    Hi, {auth.user.name}
                                </span>
                            )
                        ) : (
                            <>
                                <Link
                                    href={route("register")}
                                    className="font-medium text-gray-700 hover:text-pink-500 duration-200"
                                >
                                    Sign up
                                </Link>
                                <span className="text-gray-400">|</span>
                                <Link
                                    href={route("login")}
                                    className="font-medium text-gray-700 hover:text-pink-500 duration-200"
                                >
                                    Log in
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Mobile Search (visible on small screens) */}
            <div className="px-4 pb-3 md:hidden">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="w-full rounded-full bg-gray-100 px-5 pl-12 py-2 border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                    <IoSearchSharp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                </div>
            </div>
        </header>
    );
};

export default Header;
