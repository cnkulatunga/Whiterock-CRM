import TopActionRow from '@/components/TopActionRow';
import FollowupsCard from '@/components/FollowupsCard';
import NotesCard from '@/components/NotesCard';
import PromotionsCard from '@/components/PromotionsCard';
import CalendarCard from '@/components/CalendarCard';
import DocumentRequestsCard from '@/components/DocumentRequestsCard';
import TeleAgentLeadsCard from '@/components/TeleAgentLeadsCard';

export default function TeleAgentDashboard() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopActionRow />

            <main className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto">
                    {/* Primary Wide Card */}
                    <TeleAgentLeadsCard />

                    {/* Standard Cards */}
                    <FollowupsCard />
                    <NotesCard />
                    <PromotionsCard />
                    <CalendarCard />

                    {/* Secondary Wide Card */}
                    <DocumentRequestsCard />
                </div>
            </main>
        </div>
    );
}
