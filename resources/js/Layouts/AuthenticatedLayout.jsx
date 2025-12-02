import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';

import { RxDashboard } from "react-icons/rx";
import { RiSlideshow3Fill } from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";
import { GiClothes } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        {
            name: "Dashboard",
            link: route("dashboard"),
            icon: <RxDashboard size={20} />,
            active: route().current("dashboard"),
        },
        {
            name: "Carousel",
            link: route("carousels.index"),
            icon: <RiSlideshow3Fill size={20} />,
            active: route().current("carousels.*"),
        },
        {
            name: "Category",
            link: route("category.index"),
            icon: <BiCategoryAlt size={20} />,
            active: route().current("category.*"),
        },
        {
            name: "Product",
            link: route("product.index"),
            icon: <GiClothes size={20} />,
            active: route().current("product.*"),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">

            {/* ==================== SIDEBAR ==================== */}
            <aside
                className={`
                    bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                    transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen z-30
                    ${sidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"}
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <Link href="/">
                        <h1 className="text-3xl font-bold tracking-wide text-gray-900">
                        Dress<span className="text-pink-500">.</span>
                    </h1>
                    </Link>
                </div>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {menuItems.map((item, index) => (
                        <SidebarItem key={index} item={item} sidebarOpen={sidebarOpen} />
                    ))}
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-2 py-2 rounded-md
                        text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600
                        dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiLogOut size={20} />
                        <span className={`${!sidebarOpen && "lg:hidden"}`}>Log Out</span>
                    </Link>
                </div>
            </aside>

            {/* ==================== MAIN CONTENT ==================== */}
            <div
                className={`
                    flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300
                    ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
                `}
            >
                {/* Top Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 border text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                {user.name}
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {header && <h2 className="text-2xl mb-6 font-semibold">{header}</h2>}
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

function SidebarItem({ item, sidebarOpen }) {
    return (
        <Link
            href={item.link}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200
                ${item.active
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700"}
            `}
        >
            {item.icon}
            <span className={`${!sidebarOpen && "hidden lg:hidden"} lg:block`}>
                {item.name}
            </span>
        </Link>
    );
}
