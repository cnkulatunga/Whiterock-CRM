'use client';

import { useState } from 'react';
import TopActionRow from "@/components/TopActionRow";
import FollowupsCard from "@/components/FollowupsCard";
import NotesCard from "@/components/NotesCard";
import LicensesCard from "@/components/LicensesCard";
import TeleAgentsCard from "@/components/TeleAgentsCard";
import PortfolioCard from "@/components/PortfolioCard";
import PayoutsCard from "@/components/PayoutsCard";
import PromotionsCard from "@/components/PromotionsCard";
import CalendarCard from "@/components/CalendarCard";
import DetailDrawer from "@/components/DetailDrawer";

export default function SuperAdminDashboard() {
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [drawerType, setDrawerType] = useState<'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSelect = (entity: any, type: any) => {
        setSelectedEntity(entity);
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <TopActionRow />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-[2000px] mx-auto">
                    <FollowupsCard onSelect={handleSelect} />
                    <NotesCard />
                    <LicensesCard />
                    <TeleAgentsCard onSelect={handleSelect} />
                    <PortfolioCard />
                    <PayoutsCard />
                    <PromotionsCard onSelect={handleSelect} />
                    <CalendarCard />

                    {/* Quick Stats Summary Card */}
                    <div className="glass-card flex flex-col h-[280px] p-6 justify-between bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl shadow-indigo-100">
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest opacity-60">System Health</h3>
                            <p className="text-2xl font-black mt-2">Core Performance</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-[10px] font-bold uppercase opacity-60">Total Pipeline</span>
                                <span className="text-xl font-black">$4.2M</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-2">
                                <span className="text-[10px] font-bold uppercase opacity-60">Success Rate</span>
                                <span className="text-xl font-black">92%</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold uppercase opacity-60">Server Uptime</span>
                                <span className="text-xl font-black">99.9%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Chatbot Widget */}
            <div className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 cursor-pointer hover:scale-110 active:scale-95 transition-all z-[1000] group">
                <i className="fa-solid fa-robot text-xl group-hover:rotate-12 transition-transform"></i>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>

            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                entity={selectedEntity}
                type={drawerType}
            />
        </div>
    );
}
