'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader } from '@/components/ui/Card';
import { Table, Pagination } from '@/components/ui/Table';
import { Badge, Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/FormInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lendersApi } from '@/lib/api/lenders';

const COLUMNS = [
  { key: 'name',         label: 'Lender Name', render: (v) => <span className="font-bold text-navy">{v}</span> },
  { key: 'type',         label: 'Type',         render: (v) => <Badge variant="indigo">{v}</Badge> },
  { key: 'contact_name', label: 'Contact' },
  { key: 'phone',        label: 'Phone' },
  { key: 'email',        label: 'Email' },
  { key: 'is_active',    label: 'Status',       render: (v) => <Badge variant={v ? 'green' : 'gray'}>{v ? 'Active' : 'Inactive'}</Badge> },
];

const BLANK = { name:'', type:'bank', contact_name:'', phone:'', email:'', notes:'' };

export default function LendersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);

  const { data, isLoading } = useQuery({
    queryKey: ['lenders', page],
    queryFn: () => lendersApi.list({ page }),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: lendersApi.create,
    onSuccess: () => { qc.invalidateQueries(['lenders']); setOpen(false); setForm(BLANK); },
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Lender Management" subtitle="Bank and lender panel" />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <PanelCard className="h-full">
          <PanelHeader
            title="All Lenders"
            icon="fa-building-columns"
            subtitle={`${data?.count ?? 0} on panel`}
            actions={<Button size="sm" icon={<i className="fas fa-plus" />} onClick={() => setOpen(true)}>Add Lender</Button>}
          />
          <div className="flex-1 overflow-hidden">
            <Table columns={COLUMNS} data={data?.results ?? []} loading={isLoading} emptyMessage="No lenders yet." />
          </div>
          <Pagination page={page} total={data?.count ?? 0} pageSize={20} onChange={setPage} />
        </PanelCard>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Lender" size="md"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button loading={createMutation.isLoading} onClick={() => createMutation.mutate(form)}>Add</Button>
        </>}
      >
        <div className="flex flex-col gap-4">
          <Input label="Lender Name" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Select label="Type" value={form.type}
            onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
            options={[{ value:'bank',label:'Bank' },{ value:'credit_union',label:'Credit Union' },{ value:'non_bank',label:'Non-Bank' },{ value:'private',label:'Private' }]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Contact Name" value={form.contact_name} onChange={(e) => setForm(f => ({ ...f, contact_name: e.target.value }))} />
            <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
          <Textarea label="Notes" rows={2} value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
