import { Head, Link, usePage } from "@inertiajs/react";
import { Carousel } from "antd";

import "../../css/app.css";
import Card from "@/Components/Card/Card";
import Header from "@/Components/Header/Header";
import RootLayout from "@/Layouts/RootLayout";
export default function Welcome({ laravelVersion, phpVersion }) {
    const {
        auth,
        carousels = [],
        categories = [],
        products = [],
    } = usePage().props;
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    const contentStyle = {
        width: "100%",
        height: "550px",
        objectFit: "cover",
    };

    return (
        <>
            <Head title="Welcome" />
            {/* <nav className="-mx-3 flex flex-1 justify-end">
                {auth.user ? (
                    auth.user.role === "admin" ? (
                        <Link
                            href={route("dashboard")}
                            className="rounded-md px-3 py-2"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <span className="px-3 py-2">
                            Welcome, {auth.user.name}
                        </span>
                    )
                ) : (
                    <>
                        <Link
                            href={route("login")}
                            className="rounded-md px-3 py-2"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route("register")}
                            className="rounded-md px-3 py-2"
                        >
                            Register
                        </Link>
                    </>
                )}
            </nav> */}

            

            {/* Carousel */}
            <Carousel
                autoplay={{ dotDuration: true }}
                autoplaySpeed={2000}
                draggable
                swipeToSlide
            >
                {carousels.slice(0, 3).map((item) => (
                    <div key={item.id}>
                        <img
                            style={contentStyle}
                            src={`/storage/${item.image_path}`}
                            alt={item.name}
                        />
                    </div>
                ))}
            </Carousel>

            {/* Category */}
            <div className="container mx-auto mt-5">
                <h1 className="uppercase text-5xl font-bold">categories</h1>
                <div className="flex items-center justify-between gap-11 mt-5">
                    {/* Category content goes here */}
                    {categories.map((category) => (
                        <div key={category.id} className="border relative">
                            <p className="uppercase absolute text-5xl font-bold top-1/4 left-[50px]">
                                {category.name}
                            </p>
                            <img
                                src={`/storage/${category.image_path}`}
                                alt={category.name}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Product */}
            <div className="container mx-auto mt-5">
                <h1 className="uppercase text-3xl font-bold">
                    product overview
                </h1>
                <div className="mt-3">
                    <div className="grid grid-cols-5 gap-3">
                        {products.map((product) => (
                            <Link href={(route('product.show',product.id))} key={product.id}>

                                <Card
                                    key={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image_path={`/storage/${product.image_path}`}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
Welcome.layout = (page) => <RootLayout children={page} />;
