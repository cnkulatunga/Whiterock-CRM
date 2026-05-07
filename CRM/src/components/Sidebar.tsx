'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import ProfileDrawer from './ProfileDrawer';

const navItems = [
    { id: 'nav-dashboard', name: 'Dashboard', icon: 'fa-gauge-high', path: '/dashboard', moduleKey: 'dashboard' },
    { id: 'nav-tasks', name: 'Tasks', icon: 'fa-tasks', path: '/tasks', moduleKey: 'tasks' },
    { id: 'nav-leads', name: 'Leads', icon: 'fa-user-group', path: '/leads', moduleKey: 'leads' },
    { id: 'nav-pipeline', name: 'Pipeline', icon: 'fa-diagram-project', path: '/pipeline', moduleKey: 'pipeline' },
    { id: 'nav-lenders', name: 'Lenders', icon: 'fa-hand-holding-dollar', path: '/lenders', moduleKey: 'lenders' },
    { id: 'nav-users', name: 'Users', icon: 'fa-user-gear', path: '/users', moduleKey: 'users' },
    { id: 'nav-permissions', name: 'Matrix', icon: 'fa-shield-halved', path: '/permissions', moduleKey: 'users', roleOnly: ['Super Admin', 'Admin'] },
    { id: 'nav-docs', name: 'Docs', icon: 'fa-folder-open', path: '/docs', moduleKey: 'docs' },
    { id: 'nav-reports', name: 'Reports', icon: 'fa-chart-line', path: '/reports', moduleKey: 'reports' },
];

import { usePermissions } from '@/hooks/usePermissions';

export default function Sidebar() {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { userRole, hasModule, isLoading } = usePermissions();
    const [dashboardPath, setDashboardPath] = useState('/dashboard/super_admin');
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const session = JSON.parse(sessionStorage.getItem('crm_session') || 'null');
        if (session && session.landing) {
            const parts = session.landing.split('/');
            const page = parts[parts.length - 1].replace('.html', '');
            setDashboardPath(`/dashboard/${page}`);
        }

        // Fetch notifications count
        fetch('/api/notifications')
            .then(res => res.json())
            .then(data => setNotifCount(data.filter((n: any) => !n.read).length))
            .catch(() => { });
    }, []);

    // Close mobile nav on route change
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    if (isLoading) return (
        <>
            <div className="hidden md:block w-[70px] bg-[#0f172a] h-screen border-r border-[#1e293b]" />
            <button
                className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-[#0f172a] rounded-lg flex items-center justify-center text-white border border-[#1e293b]"
                aria-label="Open navigation"
                disabled
            >
                <i className="fa-solid fa-bars text-sm"></i>
            </button>
        </>
    );

    return (
        <>
            {/* Mobile hamburger — only visible below md */}
            <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-[#0f172a] rounded-lg flex items-center justify-center text-white border border-[#1e293b] shadow-lg"
                aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            >
                <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-sm transition-all`}></i>
            </button>

            {/* Backdrop — mobile only */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <nav className={`side-nav w-[70px] bg-[#0f172a] h-screen flex flex-col items-center py-3 gap-1 border-r border-[#1e293b] shrink-0
                fixed md:relative z-50 transition-transform duration-300
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="mb-6 shrink-0">
                    <div className="w-[38px] h-[38px] bg-white/10 rounded-lg flex items-center justify-center text-white shadow-inner">
                        <i className="fa-solid fa-bolt text-lg"></i>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 flex-1 overflow-y-auto w-full px-0 no-scrollbar">
                {navItems.map((item) => {
                    // 1. Check Module Access
                    if (item.moduleKey !== 'dashboard' && !hasModule(item.moduleKey)) return null;

                    // 2. Check Role Restrictions
                    if (item.roleOnly && userRole && !item.roleOnly.includes(userRole)) return null;

                    const finalPath = item.id === 'nav-dashboard' ? dashboardPath : item.path;
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/') || (item.id === 'nav-dashboard' && pathname.includes('/dashboard/'));

                    return (
                        <Link
                            key={item.name}
                            href={finalPath}
                            className={`flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10 ${isActive ? 'text-white bg-white/10 active shadow-sm' : ''}`}
                        >
                            <i className={`fa-solid ${item.icon} text-sm`}></i>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-none">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
                </div>

                <div className="shrink-0 flex flex-col gap-1 items-center pt-1">
                    <div
                        onClick={() => setIsProfileOpen(true)}
                        className="flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10 group"
                    >
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-slate-500 relative">
                            <i className="fa-solid fa-user text-[10px]"></i>
                            {notifCount > 0 && (
                                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full border border-[#0f172a]"></span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-none">Profile</span>
                    </div>
                    <Link
                        href="/login"
                        onClick={() => sessionStorage.removeItem('crm_session')}
                        className="flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-red-400 hover:bg-red-500/10"
                    >
                        <i className="fa-solid fa-right-from-bracket text-sm"></i>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-none">Logout</span>
                    </Link>
                </div>
            </nav>
            <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </>
    );
}
