'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader } from '@/components/ui/Card';
import { Table, Pagination } from '@/components/ui/Table';
import { Badge, Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/FormInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';

const ROLE_OPTIONS = [
  { value: 'super_admin',      label: 'Super Admin' },
  { value: 'tele_agent',       label: 'Tele Agent' },
  { value: 'accounts_manager', label: 'Accounts Manager' },
  { value: 'team_lead',        label: 'Team Lead' },
];

const ROLE_VARIANT = {
  super_admin: 'indigo', tele_agent: 'blue',
  accounts_manager: 'green', team_lead: 'yellow',
};

const COLUMNS = [
  { key: 'full_name',  label: 'Name',     render: (v, r) => <div><p className="font-bold text-navy text-[10px]">{r.first_name} {r.last_name}</p><p className="text-muted text-[8px]">{r.email}</p></div> },
  { key: 'role',       label: 'Role',     render: (v) => <Badge variant={ROLE_VARIANT[v] || 'gray'}>{v?.replace(/_/g,' ')}</Badge> },
  { key: 'is_active',  label: 'Status',   render: (v) => <Badge variant={v ? 'green' : 'gray'}>{v ? 'Active' : 'Inactive'}</Badge> },
  { key: 'phone',      label: 'Phone' },
  { key: 'date_joined',label: 'Joined',   render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
];

const BLANK = { first_name:'', last_name:'', email:'', phone:'', role:'tele_agent', password:'' };

export default function UserManagementPage() {
  const qc = useQueryClient();
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [open, setOpen]     = useState(false);
  const [form, setForm]     = useState(BLANK);
  const [formErr, setFormErr] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => usersApi.list({ page, search }),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { qc.invalidateQueries(['users']); setOpen(false); setForm(BLANK); setFormErr(''); },
    onError: (e) => setFormErr(e.response?.data?.detail || 'Failed to create user.'),
  });

  const handleSubmit = () => {
    if (!form.first_name || !form.email || !form.password) {
      setFormErr('First name, email and password are required.'); return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="User Management" subtitle="Manage team members and permissions" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <PanelCard className="h-full">
          <PanelHeader
            title="All Users"
            icon="fa-users"
            subtitle={`${data?.count ?? 0} team members`}
            actions={
              <Button size="sm" icon={<i className="fas fa-user-plus" />} onClick={() => setOpen(true)}>
                Add User
              </Button>
            }
          />

          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-border bg-surface">
            <div className="relative flex-1 max-w-xs">
              <i className="fas fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted" />
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="form-input-premium pl-7"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Table
              columns={COLUMNS}
              data={data?.results ?? []}
              loading={isLoading}
              emptyMessage="No users found."
            />
          </div>
          <Pagination page={page} total={data?.count ?? 0} pageSize={20} onChange={setPage} />
        </PanelCard>
      </div>

      {/* Create User Modal */}
      <Modal
        open={open}
        onClose={() => { setOpen(false); setFormErr(''); }}
        title="Create New User"
        subtitle="Add a team member to the CRM"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={createMutation.isLoading} onClick={handleSubmit}>Create User</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" required value={form.first_name}
              onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} />
            <Input label="Last Name" value={form.last_name}
              onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} />
          </div>
          <Input label="Email" type="email" required value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" type="tel" value={form.phone}
            onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Select
            label="Role" required value={form.role}
            onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
            options={ROLE_OPTIONS}
          />
          <Input label="Password" type="password" required value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} />
          {formErr && <p className="text-[10px] font-bold text-red-600">{formErr}</p>}
        </div>
      </Modal>
    </div>
  );
}
