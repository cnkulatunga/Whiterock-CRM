'use client';

import { useState, useRef } from 'react';
import TopActionRow from '@/components/TopActionRow';
import FollowupsCard from '@/components/FollowupsCard';
import NotesCard from '@/components/NotesCard';
import PromotionsCard from '@/components/PromotionsCard';
import CalendarCard from '@/components/CalendarCard';
import DocumentRequestsCard from '@/components/DocumentRequestsCard';
import TeleAgentLeadsCard from '@/components/TeleAgentLeadsCard';
import DetailDrawer from '@/components/DetailDrawer';
import { usePermissions } from '@/hooks/usePermissions';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

function CardWrapper({
    designMode, dragOver, onDragStart, onDragOver, onDragLeave, onDrop, children,
}: {
    cardKey: string; designMode: boolean; dragOver: boolean;
    onDragStart: () => void; onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void; onDrop: (e: React.DragEvent) => void;
    children: React.ReactNode;
}) {
    return (
        <div
            draggable={designMode}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            style={{ outline: dragOver ? '2px solid #818cf8' : undefined, borderRadius: dragOver ? 16 : undefined, transition: 'outline 0.15s' }}
        >
            {children}
        </div>
    );
}

export default function TeleAgentDashboard() {
    const { canSeeCard, isLoading } = usePermissions();
    const { cardOrder, saveLayout, resetLayout } = useDashboardLayout('tele_agent');
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [drawerType, setDrawerType] = useState<'task' | 'lead' | 'agent' | 'promotion' | 'lender' | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [designMode, setDesignMode] = useState(false);
    const [dragOverKey, setDragOverKey] = useState<string | null>(null);
    const dragSrcKey = useRef<string | null>(null);

    const handleSelect = (entity: any, type: any) => { setSelectedEntity(entity); setDrawerType(type); setIsDrawerOpen(true); };

    const handleDragStart = (key: string) => { dragSrcKey.current = key; };
    const handleDragOver = (e: React.DragEvent, key: string) => { e.preventDefault(); if (dragSrcKey.current !== key) setDragOverKey(key); };
    const handleDragLeave = () => setDragOverKey(null);
    const handleDrop = (e: React.DragEvent, targetKey: string) => {
        e.preventDefault(); setDragOverKey(null);
        const src = dragSrcKey.current;
        if (!src || src === targetKey) return;
        const next = [...cardOrder];
        const fromIdx = next.indexOf(src); const toIdx = next.indexOf(targetKey);
        if (fromIdx === -1 || toIdx === -1) return;
        next.splice(fromIdx, 1); next.splice(toIdx, 0, src);
        saveLayout(next); dragSrcKey.current = null;
    };
    const handleToggleDesignMode = () => { setDesignMode(d => !d); setDragOverKey(null); };
    const handleResetLayout = () => { resetLayout(); setDesignMode(false); };

    const renderCard = (key: string) => {
        switch (key) {
            case 'my_leads_pipeline': return canSeeCard(key) ? <TeleAgentLeadsCard /> : null;
            case 'upcoming_followups': return canSeeCard(key) ? <FollowupsCard /> : null;
            case 'notes': return canSeeCard(key) ? <NotesCard /> : null;
            case 'lender_promotions': return canSeeCard(key) ? <PromotionsCard onSelect={handleSelect} /> : null;
            case 'op_calendar': return canSeeCard(key) ? <CalendarCard /> : null;
            case 'document_request': return canSeeCard(key) ? <DocumentRequestsCard /> : null;
            default: return null;
        }
    };

    if (isLoading) return <div className="flex-1 bg-slate-50 animate-pulse" />;

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <TopActionRow designMode={designMode} onToggleDesignMode={handleToggleDesignMode} />

            {designMode && (
                <div style={{ background: 'linear-gradient(90deg, #312e81 0%, #1e1b4b 100%)', borderBottom: '1px solid rgba(129,140,248,.2)', padding: '6px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fa-solid fa-arrows-up-down-left-right" style={{ color: '#818cf8', fontSize: 11 }}></i>
                        <span style={{ color: '#c7d2fe', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                            Design Mode — Drag cards to reorder. Layout saves automatically.
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={handleResetLayout} style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>Reset Layout</button>
                        <button onClick={handleToggleDesignMode} style={{ fontSize: 9, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '.06em', background: '#4f46e5', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>Done</button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div id="mainModuleGrid" className={`module-grid${designMode ? ' design-mode' : ''}`}>
                    {cardOrder.map((key) => {
                        const card = renderCard(key);
                        if (!card) return null;
                        return (
                            <CardWrapper key={key} cardKey={key} designMode={designMode} dragOver={dragOverKey === key}
                                onDragStart={() => handleDragStart(key)} onDragOver={(e) => handleDragOver(e, key)}
                                onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, key)}>
                                {card}
                            </CardWrapper>
                        );
                    })}
                </div>
            </div>

            <DetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} entity={selectedEntity} type={drawerType} />
        </div>
    );
}
