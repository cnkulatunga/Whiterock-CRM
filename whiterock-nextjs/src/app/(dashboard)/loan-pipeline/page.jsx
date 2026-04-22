'use client';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { loansApi } from '@/lib/api/loans';

const STAGES = ['new','qualified','submitted','approved','settled','declined'];
const STAGE_COLOR = {
  new:'#94a3b8', qualified:'#2447d7', submitted:'#f59e0b',
  approved:'#10b981', settled:'#6366f1', declined:'#ef4444',
};
const STAGE_VARIANT = { new:'gray',qualified:'blue',submitted:'yellow',approved:'green',settled:'indigo',declined:'red' };

export default function LoanPipelinePage() {
  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: loansApi.list,
  });

  const byStage = STAGES.reduce((acc, s) => ({ ...acc, [s]: loans.filter(l => l.stage === s) }), {});

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Loan Pipeline" subtitle="Kanban view of all loan files" />
      <div className="flex-1 overflow-x-auto custom-scrollbar p-4">
        <div className="flex gap-3 h-full min-w-max">
          {STAGES.map((stage) => (
            <div key={stage} className="w-[280px] flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_COLOR[stage] }} />
                <p className="text-[9px] font-black uppercase tracking-widest text-subtle">{stage}</p>
                <span className="ml-auto text-[8px] font-black text-muted bg-surface-border px-1.5 py-0.5 rounded-full">
                  {byStage[stage]?.length || 0}
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
                {byStage[stage]?.map((loan) => (
                  <div key={loan.id} className="bg-white border border-surface-border rounded-[14px] p-3 hover:-translate-y-0.5 hover:shadow-card transition-all cursor-pointer">
                    <p className="text-[11px] font-bold text-navy">{loan.applicant_name}</p>
                    <p className="text-[9px] text-muted font-medium mt-0.5">{loan.product_type?.replace(/_/g,' ')}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <p className="text-[11px] font-black text-navy">${Number(loan.loan_amount||0).toLocaleString()}</p>
                      <Badge variant={STAGE_VARIANT[loan.stage]}>{loan.stage}</Badge>
                    </div>
                    {loan.lender_name && (
                      <p className="text-[8px] text-muted font-semibold mt-1.5 flex items-center gap-1">
                        <i className="fas fa-building-columns" /> {loan.lender_name}
                      </p>
                    )}
                  </div>
                ))}
                {!isLoading && byStage[stage]?.length === 0 && (
                  <div className="flex-1 border-2 border-dashed border-surface-border rounded-[14px] flex items-center justify-center py-8">
                    <p className="text-[9px] text-muted font-semibold">No loans</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
