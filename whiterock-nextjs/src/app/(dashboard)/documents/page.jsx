'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader } from '@/components/ui/Card';
import { Badge, Button } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@/lib/api/documents';

const TYPE_ICON = {
  id: 'fa-id-card', payslip: 'fa-file-invoice-dollar', bank_statement: 'fa-bank',
  tax_return: 'fa-receipt', contract: 'fa-file-contract', other: 'fa-file',
};
const TYPE_VARIANT = { id:'blue', payslip:'green', bank_statement:'indigo', tax_return:'yellow', contract:'purple', other:'gray' };

export default function DocumentsPage() {
  const [search, setSearch] = useState('');

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ['documents', search],
    queryFn: () => documentsApi.list({ search }),
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Document Vault" subtitle="Secure file repository" />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <PanelCard className="h-full">
          <PanelHeader
            title="All Documents"
            icon="fa-folder-open"
            subtitle={`${docs.length} files`}
            actions={
              <Button size="sm" icon={<i className="fas fa-upload" />}>
                Upload
              </Button>
            }
          />
          <div className="px-4 py-3 border-b border-surface-border bg-surface">
            <div className="relative max-w-xs">
              <i className="fas fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents…"
                className="form-input-premium pl-7"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {isLoading ? (
              <div className="flex justify-center pt-12"><span className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>
            ) : docs.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <i className="fas fa-folder-open text-4xl text-surface-border mb-3 block" />
                <p className="text-[11px] font-semibold">No documents found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-3.5 bg-surface border border-surface-border rounded-[14px] hover:border-brand/30 hover:-translate-y-0.5 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${TYPE_ICON[doc.doc_type] || 'fa-file'} text-brand text-[13px]`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-navy truncate">{doc.name}</p>
                      <p className="text-[9px] text-muted font-medium">{doc.lead_name || 'General'}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant={TYPE_VARIANT[doc.doc_type] || 'gray'}>{doc.doc_type}</Badge>
                        <span className="text-[8px] text-muted">{doc.file_size_display}</span>
                      </div>
                    </div>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                      className="text-muted hover:text-brand transition-colors text-[11px]"
                      onClick={(e) => e.stopPropagation()}>
                      <i className="fas fa-download" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
