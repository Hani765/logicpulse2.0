"use client"
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    MdShoppingBag,
    MdHome,
    MdSupervisedUserCircle,
    MdCastConnected,
    MdCellTower,
    MdOutlineSettings,
} from "react-icons/md";
import { usePathname } from 'next/navigation';
import { PanelLeft, Package2 } from 'lucide-react'
const getMenuItems = (role: string | undefined) => {
    let menuItems = [
        {
            title: "Dashboard",
            menuIcon: <MdHome className='h-5 w-5 transition-all group-hover:scale-110' />,
            link: "/"
        },

        {
            title: "Offers",
            menuIcon: <MdShoppingBag className='h-5 w-5 transition-all group-hover:scale-110' />,
            link: "/offers"
        },
    ];

    if (role != "user") {
        // Add additional menu items for admin
        menuItems = [
            ...menuItems,
            {
                title: "Users",
                menuIcon: <MdSupervisedUserCircle className='h-5 w-5 transition-all group-hover:scale-110' />,
                link: "/users"
            }
        ];
    }
    if (role === "admin" || role === "administrator") {
        // Add additional menu items for admin
        menuItems = [
            ...menuItems,
            {
                title: "Networks",
                menuIcon: <MdCastConnected className='h-5 w-5 transition-all group-hover:scale-110' />,
                link: "/networks"
            },
            {
                title: "Domains",
                menuIcon: <MdCellTower className='h-5 w-5 transition-all group-hover:scale-110' />,
                link: "/domains"
            },
        ];
    }

    return menuItems;
};
const MobileNav = ({ role }: { role: string | undefined }) => {
    const pathname = usePathname();
    const menuItems = getMenuItems(role);
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">

                        <Link
                            href="#"
                            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                        >
                            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        {menuItems.map((cat) => (
                            <div key={cat.title}>
                                {pathname === cat.link ?
                                    <span
                                        className="flex items-center gap-4 px-2.5 text-foreground"
                                    >
                                        {cat.menuIcon}
                                        {cat.title}
                                    </span> :
                                    <Link
                                        href={cat.link}
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        {cat.menuIcon}
                                        {cat.title}
                                    </Link>
                                }
                            </div>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div >
    )
}

export default MobileNav
