import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useTemplates } from '@/hooks/useTemplates'
import { generateId } from '@/lib/utils'
import { ArrowLeft, Plus, Trash2, AlertTriangle, Pencil, Check } from 'lucide-react'
import type { ChecklistTemplate, ChecklistSection, ChecklistTask } from '@/types/index'

export function AdminTemplatePage() {
  const { templateId } = useParams<{ templateId: string }>()
  const { getTemplate, updateTemplate } = useTemplates()
  const template = templateId ? getTemplate(templateId) : undefined

  if (!template) return <Navigate to="/admin" replace />
  if (template.builtIn) return <Navigate to="/admin" replace />

  return <AdminTemplateInner template={template} onSave={updateTemplate} />
}

type EditingTask = { sectionId: string; task: ChecklistTask } | null
type EditingSection = ChecklistSection | null

function AdminTemplateInner({
  template,
  onSave,
}: {
  template: ChecklistTemplate
  onSave: (t: ChecklistTemplate) => void
}) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState<ChecklistTemplate>({ ...template, sections: template.sections.map(s => ({ ...s, tasks: [...s.tasks] })) })
  const [saved, setSaved] = useState(false)
  const [editingTask, setEditingTask] = useState<EditingTask>(null)
  const [editingSection, setEditingSection] = useState<EditingSection>(null)
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<{ sectionId: string; taskId: string } | null>(null)

  const handleSave = () => {
    onSave(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateField = (field: keyof ChecklistTemplate, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  const addSection = () => {
    const section: ChecklistSection = {
      id: generateId(),
      title: 'Nueva sección',
      icon: '📋',
      order: draft.sections.length + 1,
      tasks: [],
    }
    setDraft((d) => ({ ...d, sections: [...d.sections, section] }))
    setEditingSection(section)
  }

  const updateSection = (updated: ChecklistSection) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === updated.id ? updated : s)),
    }))
  }

  const deleteSection = (sectionId: string) => {
    setDraft((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== sectionId) }))
  }

  const addTask = (sectionId: string) => {
    const task: ChecklistTask = {
      id: generateId(),
      title: 'Nueva tarea',
      order: (draft.sections.find((s) => s.id === sectionId)?.tasks.length ?? 0) + 1,
    }
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId ? { ...s, tasks: [...s.tasks, task] } : s,
      ),
    }))
    setEditingTask({ sectionId, task })
  }

  const updateTask = (sectionId: string, updated: ChecklistTask) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.map((t) => (t.id === updated.id ? updated : t)) }
          : s,
      ),
    }))
  }

  const deleteTask = (sectionId: string, taskId: string) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === sectionId ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) } : s,
      ),
    }))
    setDeleteTaskTarget(null)
  }

  const currentEditTask = editingTask
    ? draft.sections.find((s) => s.id === editingTask.sectionId)?.tasks.find((t) => t.id === editingTask.task.id) ?? editingTask.task
    : null

  return (
    <PageLayout>
      <div className="pt-4 mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="gap-1.5 -ml-2">
          <ArrowLeft size={16} />
          Admin
        </Button>
        <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
          {saved ? <><Check size={14} /> Guardado</> : 'Guardar'}
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1c2b3a]">Editar procedimiento</h1>
      </div>

      <div className="space-y-6">
        {/* Template metadata */}
        <Card className="p-5 space-y-4">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider">Información general</h2>
          {[
            { label: 'Icono', field: 'icon' as const, placeholder: '🏠' },
            { label: 'Título', field: 'title' as const, placeholder: 'Nombre del procedimiento' },
            { label: 'Subtítulo', field: 'subtitle' as const, placeholder: 'Descripción breve' },
            { label: 'Descripción', field: 'description' as const, placeholder: 'Descripción larga (opcional)' },
            { label: 'Mensaje al completar', field: 'completionMessage' as const, placeholder: '¡Completado!' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="text-sm font-medium text-[#1c2b3a] block mb-1">{label}</label>
              <input
                type="text"
                value={(draft[field] as string) ?? ''}
                onChange={(e) => updateField(field, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
              />
            </div>
          ))}
        </Card>

        {/* Sections */}
        {draft.sections.map((section) => (
          <Card key={section.id} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-[#1c2b3a]">{section.title}</h3>
                <p className="text-xs text-[#888888]">{section.tasks.length} tareas</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSection(section)}
                  className="text-[#888888]"
                >
                  <Pencil size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSection(section.id)}
                  className="text-[#c0392b]"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {section.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f6f3]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1c2b3a] truncate">{task.title}</p>
                    {task.critical && (
                      <Badge variant="critical" className="mt-0.5">
                        <AlertTriangle size={10} /> crítica
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTask({ sectionId: section.id, task })}
                      className="text-[#888888]"
                    >
                      <Pencil size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTaskTarget({ sectionId: section.id, taskId: task.id })}
                      className="text-[#c0392b]"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => addTask(section.id)}
              className="gap-1.5 text-[#888888]"
            >
              <Plus size={13} />
              Añadir tarea
            </Button>
          </Card>
        ))}

        <Button
          variant="secondary"
          size="md"
          onClick={addSection}
          className="w-full justify-center gap-2"
        >
          <Plus size={16} />
          Añadir sección
        </Button>
      </div>

      {/* Edit section modal */}
      <Modal
        open={!!editingSection}
        onClose={() => setEditingSection(null)}
        title="Editar sección"
      >
        {editingSection && (
          <SectionEditor
            section={draft.sections.find((s) => s.id === editingSection.id) ?? editingSection}
            onSave={(s) => { updateSection(s); setEditingSection(null) }}
            onCancel={() => setEditingSection(null)}
          />
        )}
      </Modal>

      {/* Edit task modal */}
      <Modal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Editar tarea"
      >
        {editingTask && currentEditTask && (
          <TaskEditor
            task={currentEditTask}
            onSave={(t) => { updateTask(editingTask.sectionId, t); setEditingTask(null) }}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* Delete task modal */}
      <Modal
        open={!!deleteTaskTarget}
        onClose={() => setDeleteTaskTarget(null)}
        title="Eliminar tarea"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#888888]">¿Eliminar esta tarea? No se puede deshacer.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteTaskTarget(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() =>
                deleteTaskTarget && deleteTask(deleteTaskTarget.sectionId, deleteTaskTarget.taskId)
              }
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}

function SectionEditor({
  section,
  onSave,
  onCancel,
}: {
  section: ChecklistSection
  onSave: (s: ChecklistSection) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(section)
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Icono</label>
        <input
          type="text"
          value={draft.icon}
          onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
          className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Título</label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" onClick={() => onSave(draft)}>Guardar</Button>
      </div>
    </div>
  )
}

function TaskEditor({
  task,
  onSave,
  onCancel,
}: {
  task: ChecklistTask
  onSave: (t: ChecklistTask) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(task)
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Título</label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Nota (opcional)</label>
        <textarea
          value={draft.note ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value || undefined }))}
          rows={2}
          className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20 resize-none"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Tiempo estimado (minutos)</label>
        <input
          type="number"
          min={1}
          value={draft.estimatedMinutes ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, estimatedMinutes: e.target.value ? Number(e.target.value) : undefined }))}
          className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={draft.critical ?? false}
          onChange={(e) => setDraft((d) => ({ ...d, critical: e.target.checked || undefined }))}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm text-[#1c2b3a]">Tarea crítica</span>
        <AlertTriangle size={14} className="text-[#c0392b]" />
      </label>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" onClick={() => onSave(draft)} disabled={!draft.title.trim()}>
          Guardar
        </Button>
      </div>
    </div>
  )
}
