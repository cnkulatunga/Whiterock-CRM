'use client';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { PanelCard, PanelHeader } from '@/components/ui/Card';
import { Badge, Button } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/FormInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/lib/api/tasks';

const PRIORITY_VARIANT = { low:'gray', medium:'yellow', high:'red', urgent:'red' };

export default function TasksPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', priority:'medium', due_date:'' });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.list,
  });

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => { qc.invalidateQueries(['tasks']); setOpen(false); setForm({ title:'', description:'', priority:'medium', due_date:'' }); },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, completed }) => tasksApi.update(id, { completed }),
    onSuccess: () => qc.invalidateQueries(['tasks']),
  });

  const pending = tasks.filter(t => !t.completed);
  const done    = tasks.filter(t => t.completed);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Tasks & Follow-ups" subtitle="Your action items and reminders" />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="grid grid-cols-2 gap-4 h-full">

          {/* Pending */}
          <PanelCard>
            <PanelHeader
              title="Pending Tasks"
              icon="fa-list-check"
              subtitle={`${pending.length} items`}
              actions={<Button size="xs" onClick={() => setOpen(true)}><i className="fas fa-plus" /></Button>}
            />
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
              {isLoading ? (
                <div className="flex justify-center pt-8"><span className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>
              ) : pending.length === 0 ? (
                <div className="text-center py-12 text-muted text-[10px]">
                  <i className="fas fa-check-circle text-2xl text-surface-border mb-3 block" />
                  All caught up!
                </div>
              ) : pending.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-surface rounded-[10px] border border-surface-border hover:border-brand/30 transition-colors group">
                  <button
                    onClick={() => completeMutation.mutate({ id: task.id, completed: true })}
                    className="mt-0.5 w-4 h-4 rounded-full border-2 border-surface-border group-hover:border-brand transition-colors flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-navy">{task.title}</p>
                    {task.description && <p className="text-[9px] text-muted mt-0.5 truncate">{task.description}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={PRIORITY_VARIANT[task.priority] || 'gray'}>{task.priority}</Badge>
                      {task.due_date && (
                        <span className="text-[8px] font-semibold text-muted flex items-center gap-1">
                          <i className="fas fa-calendar" /> {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          {/* Completed */}
          <PanelCard>
            <PanelHeader title="Completed" icon="fa-check-circle" subtitle={`${done.length} items`} />
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2">
              {done.length === 0 ? (
                <div className="text-center py-12 text-muted text-[10px]">No completed tasks yet</div>
              ) : done.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-surface rounded-[10px] border border-surface-border opacity-60">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-white text-[7px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-navy line-through">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Task"
        subtitle="Add a follow-up or action item"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button loading={createMutation.isLoading} onClick={() => createMutation.mutate(form)}>Create</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Title" required value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Description" rows={2} value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority" value={form.priority}
              onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
              options={[
                { value:'low', label:'Low' },{ value:'medium', label:'Medium' },
                { value:'high', label:'High' },{ value:'urgent', label:'Urgent' },
              ]}
            />
            <Input label="Due Date" type="date" value={form.due_date}
              onChange={(e) => setForm(f => ({ ...f, due_date: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
