'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader } from '@/components/ui/Card';
import { Table, Pagination } from '@/components/ui/Table';
import { Badge, Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/FormInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/lib/api/leads';

const STAGE_VARIANT = {
  new: 'blue', contacted: 'indigo', qualified: 'purple',
  in_progress: 'yellow', submitted: 'orange', approved: 'green',
  settled: 'green', declined: 'red', withdrawn: 'gray',
};

const PRODUCT_OPTIONS = [
  { value: '', label: 'All Products' },
  { value: 'home_loan', label: 'Home Loan' },
  { value: 'investment', label: 'Investment Loan' },
  { value: 'refinance', label: 'Refinance' },
  { value: 'construction', label: 'Construction Loan' },
  { value: 'smsf', label: 'SMSF Loan' },
];

const STAGE_OPTIONS = [
  { value: '', label: 'All Stages' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'settled', label: 'Settled' },
  { value: 'declined', label: 'Declined' },
];

const COLUMNS = [
  { key: 'full_name',    label: 'Lead Name',   render: (v) => <span className="font-bold text-navy">{v}</span> },
  { key: 'phone',        label: 'Phone' },
  { key: 'product_type', label: 'Product',     render: (v) => v?.replace(/_/g, ' ') },
  { key: 'loan_amount',  label: 'Loan Amt',    render: (v) => v ? `$${Number(v).toLocaleString()}` : '—' },
  { key: 'stage',        label: 'Stage',       render: (v) => <Badge variant={STAGE_VARIANT[v] || 'gray'}>{v}</Badge> },
  { key: 'assigned_to_name', label: 'Agent',   render: (v) => v || '—' },
  { key: 'created_at',  label: 'Created',      render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
];

export default function LeadsPage() {
  const qc = useQueryClient();
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [filters, setFilters]     = useState({ stage: '', product_type: '' });
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [newLead, setNewLead]     = useState({ first_name:'', last_name:'', email:'', phone:'', product_type:'home_loan', loan_amount:'', notes:'' });

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, search, filters],
    queryFn: () => leadsApi.list({ page, search, ...filters }),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => { qc.invalidateQueries(['leads']); setCreateOpen(false); setNewLead({ first_name:'', last_name:'', email:'', phone:'', product_type:'home_loan', loan_amount:'', notes:'' }); },
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Lead Management Hub" subtitle="Pipeline & contact tracking" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <PanelCard className="h-full">
          <PanelHeader
            title="All Leads"
            icon="fa-magnifying-glass"
            subtitle={`${data?.count ?? 0} total records`}
            actions={
              <Button size="sm" icon={<i className="fas fa-plus" />} onClick={() => setCreateOpen(true)}>
                New Lead
              </Button>
            }
          />

          {/* Filters */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border bg-surface">
            <div className="relative flex-1 max-w-[260px]">
              <i className="fas fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted" />
              <input
                type="text"
                placeholder="Search by name, email, phone…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="form-input-premium pl-7 text-[10px]"
              />
            </div>
            <select
              value={filters.stage}
              onChange={(e) => setFilters(f => ({ ...f, stage: e.target.value }))}
              className="form-input-premium w-[140px]"
            >
              {STAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={filters.product_type}
              onChange={(e) => setFilters(f => ({ ...f, product_type: e.target.value }))}
              className="form-input-premium w-[160px]"
            >
              {PRODUCT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-hidden">
            <Table
              columns={COLUMNS}
              data={data?.results ?? []}
              loading={isLoading}
              onRowClick={(row) => setSelected(row)}
              emptyMessage="No leads found. Create your first lead!"
            />
          </div>

          <Pagination page={page} total={data?.count ?? 0} pageSize={20} onChange={setPage} />
        </PanelCard>
      </div>

      {/* Create Lead Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Register New Lead"
        subtitle="Enter prospect details to start a pipeline entry"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              loading={createMutation.isLoading}
              onClick={() => createMutation.mutate(newLead)}
            >
              Create Lead
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" required value={newLead.first_name}
            onChange={(e) => setNewLead(l => ({ ...l, first_name: e.target.value }))} />
          <Input label="Last Name" required value={newLead.last_name}
            onChange={(e) => setNewLead(l => ({ ...l, last_name: e.target.value }))} />
          <Input label="Email" type="email" value={newLead.email}
            onChange={(e) => setNewLead(l => ({ ...l, email: e.target.value }))} />
          <Input label="Phone" type="tel" value={newLead.phone}
            onChange={(e) => setNewLead(l => ({ ...l, phone: e.target.value }))} />
          <Select
            label="Product Type" required
            value={newLead.product_type}
            onChange={(e) => setNewLead(l => ({ ...l, product_type: e.target.value }))}
            options={PRODUCT_OPTIONS.filter(o => o.value)}
          />
          <Input label="Loan Amount ($)" type="number" value={newLead.loan_amount}
            onChange={(e) => setNewLead(l => ({ ...l, loan_amount: e.target.value }))} />
          <div className="col-span-2">
            <Textarea label="Notes" rows={3} value={newLead.notes}
              onChange={(e) => setNewLead(l => ({ ...l, notes: e.target.value }))} />
          </div>
        </div>
        {createMutation.error && (
          <p className="mt-3 text-[10px] font-bold text-red-600">
            {createMutation.error.response?.data?.detail || 'Failed to create lead.'}
          </p>
        )}
      </Modal>
    </div>
  );
}
