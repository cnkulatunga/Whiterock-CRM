'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import ProfileDrawer from './ProfileDrawer';

const navItems = [
    { name: 'Dashboard', icon: 'fa-gauge-high', path: '/dashboard/super_admin' },
    { name: 'Tasks', icon: 'fa-tasks', path: '/tasks' },
    { name: 'Leads', icon: 'fa-user-group', path: '/leads' },
    { name: 'Pipeline', icon: 'fa-diagram-project', path: '/pipeline' },
    { name: 'Lenders', icon: 'fa-hand-holding-dollar', path: '/lenders' },
    { name: 'Users', icon: 'fa-user-gear', path: '/users' },
    { name: 'Docs', icon: 'fa-folder-open', path: '/docs' },
    { name: 'Reports', icon: 'fa-chart-line', path: '/reports' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <nav className="side-nav w-[70px] bg-[#0f172a] h-screen flex flex-col items-center py-3 gap-1 border-r border-[#1e293b] shrink-0 overflow-hidden">
                <div className="mb-6">
                    <Image src="/alpha.png" alt="Alpha Funding" width={38} height={38} className="object-contain rounded-lg" />
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        className={`flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10 ${pathname === item.path ? 'text-white bg-white/10 active' : ''
                            }`}
                    >
                        <i className={`fa-solid ${item.icon} text-sm`}></i>
                        <span className="text-[7px] font-bold uppercase tracking-wider text-center leading-none">
                            {item.name}
                        </span>
                    </Link>
                ))}

                <div className="mt-auto flex flex-col gap-1 items-center">
                    <div
                        onClick={() => setIsProfileOpen(true)}
                        className="flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10"
                    >
                        <i className="fa-solid fa-circle-user text-sm"></i>
                        <span className="text-[7px] font-bold uppercase tracking-wider text-center leading-none">Profile</span>
                    </div>
                    <Link
                        href="/login"
                        className="flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10"
                    >
                        <i className="fa-solid fa-right-from-bracket text-sm"></i>
                        <span className="text-[7px] font-bold uppercase tracking-wider text-center leading-none">Logout</span>
                    </Link>
                </div>
            </nav>
            <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
}
