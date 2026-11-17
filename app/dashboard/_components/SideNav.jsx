"use client";

import { LayoutDashboard, FileVideo, ShieldPlus, CircleUser } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
    const MenuOption = [
        {
            id: 1,
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            id: 2,
            name: "Create New",
            path: "/dashboard/create-new",
            icon: FileVideo,
        },
        {
            id: 3,
            name: "Upgrade",
            path: "/upgrade",
            icon: ShieldPlus,
        },
        {
            id: 4,
            name: "Account",
            path: "/account",
            icon: CircleUser,
        },
    ];

    const path = usePathname();

    return (
        <div className='w-64 h-screen shadow-md p-5'>
            <div className='grid gap-3'>
                {MenuOption.map((item) => {
                    const isActive = path === item.path;

                    return (
                        <Link
                            key={item.id}
                            href={item.path}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <div
                                className={`flex items-center gap-3 rounded-md p-3 cursor-pointer ${
                                    isActive ? "bg-primary text-white" : ""
                                }`}
                            >
                                <item.icon />
                                <h2>{item.name}</h2>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
)}

export default SideNav;