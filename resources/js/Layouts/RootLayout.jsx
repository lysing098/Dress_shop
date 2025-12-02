import Header from "@/Components/Header/Header";
import { usePage } from "@inertiajs/react";
import React from "react";

const RootLayout = ({ children }) => {
    const { auth } = usePage().props;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            {/* Main content (flex-grow to push footer down) */}
            <main className="flex-1 pt-[80px] container mx-auto w-full">
                {children}
            </main>

            {/* Footer fixed at bottom when page short */}
            <footer className="bg-gray-900 text-white py-4 mt-10">
                <div className="container mx-auto text-center">
                    © 2025 Dress. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default RootLayout;
