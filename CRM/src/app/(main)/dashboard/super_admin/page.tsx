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

import { usePermissions } from "@/hooks/usePermissions";

export default function SuperAdminDashboard() {
    const { canSeeCard, hasFeature, isLoading } = usePermissions();
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [drawerType, setDrawerType] = useState<'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiOpen, setAiOpen] = useState(false);
    const [designMode, setDesignMode] = useState(false);

    const handleSelect = (entity: any, type: any) => {
        setSelectedEntity(entity);
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    if (isLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

    const aiOptions = [
        { icon: 'fa-chart-line', bg: 'bg-indigo-50', color: 'text-indigo-600', title: 'Pipeline Analysis', desc: 'AI insights on your loan pipeline' },
        { icon: 'fa-users', bg: 'bg-emerald-50', color: 'text-emerald-600', title: 'Lead Scoring', desc: 'Auto-score and prioritise leads' },
        { icon: 'fa-file-invoice', bg: 'bg-amber-50', color: 'text-amber-600', title: 'Report Generator', desc: 'Generate performance reports' },
        { icon: 'fa-robot', bg: 'bg-rose-50', color: 'text-rose-600', title: 'AI Assistant', desc: 'Ask anything about your CRM' },
    ];

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <TopActionRow
                designMode={designMode}
                onToggleDesignMode={() => setDesignMode(d => !d)}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div id="mainModuleGrid" className={`module-grid${designMode ? ' design-mode' : ''}`}>
                    {canSeeCard('upcoming_followups') && <FollowupsCard />}
                    {canSeeCard('notes') && <NotesCard />}
                    {canSeeCard('license_insurance') && <LicensesCard />}
                    {canSeeCard('online_agents') && <TeleAgentsCard />}
                    {canSeeCard('lead_portfolio') && <PortfolioCard />}
                    {canSeeCard('pending_payouts') && <PayoutsCard />}
                    {canSeeCard('lender_promotions') && <PromotionsCard onSelect={handleSelect} />}
                    {canSeeCard('op_calendar') && <CalendarCard />}
                </div>
            </div>

            {/* AI Chatbot FAB */}
            {hasFeature('ai_assistant') && (
                <div
                    onClick={() => setAiOpen(!aiOpen)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[#2447d7] rounded-2xl flex items-center justify-center text-white shadow-[0_10px_25px_rgba(36,71,215,0.4)] cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all z-[1000] group"
                >
                    <i className={`fa-solid ${aiOpen ? 'fa-xmark' : 'fa-robot'} text-xl group-hover:rotate-12 transition-transform`}></i>
                    {!aiOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>}
                </div>
            )}

            {/* AI Widget Panel */}
            {aiOpen && (
                <div className="fixed bottom-24 right-6 w-[320px] bg-white/95 backdrop-blur-xl border border-white/20 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[999]"
                    style={{ animation: 'widgetReveal 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
                    <style>{`@keyframes widgetReveal { from { opacity:0; transform:translateY(20px) scale(0.9); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
                    <div className="px-5 py-4 border-b border-slate-100 bg-white/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#2447d7] flex items-center justify-center text-white">
                                <i className="fa-solid fa-robot text-sm"></i>
                            </div>
                            <div>
                                <div className="text-[11px] font-black text-slate-900">AI Command Centre</div>
                                <div className="text-[8px] font-bold text-emerald-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Online
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {aiOptions.map((opt, i) => (
                            <div key={i} className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-white/80 hover:translate-x-1 transition-all border-b border-slate-50 last:border-0">
                                <div className={`w-[42px] h-[42px] rounded-xl ${opt.bg} flex items-center justify-center ${opt.color} shrink-0 shadow-sm`}>
                                    <i className={`fa-solid ${opt.icon} text-sm`}></i>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-900">{opt.title}</div>
                                    <div className="text-[8px] text-slate-400 mt-0.5">{opt.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                entity={selectedEntity}
                type={drawerType}
            />
        </div>
    );
}
