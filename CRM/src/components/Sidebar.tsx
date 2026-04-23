'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import ProfileDrawer from './ProfileDrawer';

const navItems = [
    { id: 'nav-dashboard', name: 'Dashboard', icon: 'fa-gauge-high', path: '/dashboard' },
    { id: 'nav-tasks', name: 'Tasks', icon: 'fa-tasks', path: '/tasks' },
    { id: 'nav-leads', name: 'Leads', icon: 'fa-user-group', path: '/leads' },
    { id: 'nav-pipeline', name: 'Pipeline', icon: 'fa-diagram-project', path: '/pipeline' },
    { id: 'nav-lenders', name: 'Lenders', icon: 'fa-hand-holding-dollar', path: '/lenders/add' },
    { id: 'nav-users', name: 'Users', icon: 'fa-user-gear', path: '/users' },
    { id: 'nav-permissions', name: 'Matrix', icon: 'fa-shield-halved', path: '/permissions' },
    { id: 'nav-docs', name: 'Docs', icon: 'fa-folder-open', path: '/docs' },
    { id: 'nav-reports', name: 'Reports', icon: 'fa-chart-line', path: '/reports' },
];

const ROLE_NAV: Record<string, string[]> = {
    'Admin': ['nav-dashboard', 'nav-tasks', 'nav-leads', 'nav-pipeline', 'nav-lenders', 'nav-docs', 'nav-users', 'nav-permissions', 'nav-reports'],
    'Team Leader': ['nav-dashboard', 'nav-tasks', 'nav-leads'],
    'Tele Agent': ['nav-dashboard', 'nav-tasks', 'nav-leads'],
    'Accounts Manager': ['nav-dashboard', 'nav-tasks', 'nav-leads', 'nav-lenders']
};

export default function Sidebar() {
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userRole, setUserRole] = useState<string>('Admin');
    const [dashboardPath, setDashboardPath] = useState('/dashboard/super_admin');

    useEffect(() => {
        const session = JSON.parse(sessionStorage.getItem('crm_session') || 'null');
        if (session) {
            setUserRole(session.role || 'Admin');
            if (session.landing) {
                const parts = session.landing.split('/');
                const page = parts[parts.length - 1].replace('.html', '');
                setDashboardPath(`/dashboard/${page}`);
            }
        }
    }, []);

    const allowedNav = ROLE_NAV[userRole] || ROLE_NAV['Admin'];

    return (
        <>
            <nav className="side-nav w-[70px] bg-[#0f172a] h-screen flex flex-col items-center py-3 gap-1 border-r border-[#1e293b] shrink-0 overflow-hidden">
                <div className="mb-6">
                    <div className="w-[38px] h-[38px] bg-white/10 rounded-lg flex items-center justify-center text-white shadow-inner">
                        <i className="fa-solid fa-bolt text-lg"></i>
                    </div>
                </div>

                {navItems.map((item) => {
                    if (!allowedNav.includes(item.id)) return null;

                    const finalPath = item.id === 'nav-dashboard' ? dashboardPath : item.path;
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/') || (item.id === 'nav-dashboard' && pathname.includes('/dashboard/'));

                    return (
                        <Link
                            key={item.name}
                            href={finalPath}
                            className={`flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10 ${isActive ? 'text-white bg-white/10 active shadow-sm' : ''}`}
                        >
                            <i className={`fa-solid ${item.icon} text-sm`}></i>
                            <span className="text-[7px] font-bold uppercase tracking-wider text-center leading-none">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                <div className="mt-auto flex flex-col gap-1 items-center">
                    <div
                        onClick={() => setIsProfileOpen(true)}
                        className="flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-white hover:bg-white/10 group"
                    >
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-slate-500">
                            <i className="fa-solid fa-user text-[10px]"></i>
                        </div>
                        <span className="text-[7px] font-bold uppercase tracking-wider text-center leading-none">Profile</span>
                    </div>
                    <Link
                        href="/login"
                        onClick={() => sessionStorage.removeItem('crm_session')}
                        className="flex flex-col items-center gap-1 text-[#94a3b8] transition-all cursor-pointer no-underline p-1.5 rounded-lg w-[54px] hover:text-red-400 hover:bg-red-500/10"
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
