'use client';

import { useState } from 'react';
import TopActionRow from '@/components/TopActionRow';
import FollowupsCard from '@/components/FollowupsCard';
import NotesCard from '@/components/NotesCard';
import PromotionsCard from '@/components/PromotionsCard';
import CalendarCard from '@/components/CalendarCard';
import DocumentRequestsCard from '@/components/DocumentRequestsCard';
import TeleAgentLeadsCard from '@/components/TeleAgentLeadsCard';
import DetailDrawer from '@/components/DetailDrawer';

export default function TeleAgentDashboard() {
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [drawerType, setDrawerType] = useState<'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleSelect = (entity: any, type: any) => {
        setSelectedEntity(entity);
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopActionRow />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto">
                    {/* Primary Wide Card */}
                    <TeleAgentLeadsCard />

                    {/* Standard Cards */}
                    <FollowupsCard onSelect={handleSelect} />
                    <NotesCard />
                    <PromotionsCard onSelect={handleSelect} />
                    <CalendarCard />

                    {/* Secondary Wide Card */}
                    <DocumentRequestsCard />
                </div>
            </main>

            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                entity={selectedEntity}
                type={drawerType}
            />
        </div>
    );
}
