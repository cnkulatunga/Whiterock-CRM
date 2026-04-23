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
import AiSummaryDrawer from "@/components/AiSummaryDrawer";

import { usePermissions } from "@/hooks/usePermissions";
import { aiOptions } from "@/data/dummy";

export default function SuperAdminDashboard() {
    const { canSeeCard, hasFeature, isLoading } = usePermissions();
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [drawerType, setDrawerType] = useState<'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
    const [designMode, setDesignMode] = useState(false);

    const handleSelect = (entity: any, type: any) => {
        setSelectedEntity(entity);
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    if (isLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

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
                    onClick={() => setAiSummaryOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-[#2447d7] rounded-2xl flex items-center justify-center text-white shadow-[0_10px_25px_rgba(36,71,215,0.4)] cursor-pointer hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all z-[1000] group"
                >
                    <i className={`fa-solid fa-robot text-xl group-hover:rotate-12 transition-transform`}></i>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
            )}



            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                entity={selectedEntity}
                type={drawerType}
            />

            <AiSummaryDrawer 
                isOpen={aiSummaryOpen}
                onClose={() => setAiSummaryOpen(false)}
            />
        </div>
    );
}
