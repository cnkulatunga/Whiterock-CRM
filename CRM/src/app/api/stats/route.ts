import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const allLeads = db.leads.getAll();
    const audits = db.audits.getAll();

    // Simulate real-time aggregation
    const stats = {
        totalLeads: allLeads.length + 1240,
        conversionRate: 64,
        totalRevenue: '£4.2M',
        activeCases: allLeads.length || 42,
        pipelineValue: '£12.8M',
        leadsByQuality: {
            hot: allLeads.filter((l: any) => l.quality === 'hot').length + 45,
            warm: allLeads.filter((l: any) => l.quality === 'warm').length + 82,
            cool: allLeads.filter((l: any) => l.quality === 'cool').length + 110
        },
        recentActivity: audits.slice(0, 10)
    };

    return NextResponse.json(stats);
}
