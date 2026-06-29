import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import { ArrowLeft, Plus, Clock, CheckCircle2, History } from 'lucide-react'
import { useEntries } from '@/hooks/useEntries'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { todayISO, formatDateShort } from '@/lib/utils'
import type { ChecklistTemplate } from '@/types/index'

const templateMap: Record<string, ChecklistTemplate> = Object.fromEntries(
  BUILT_IN_TEMPLATES.map((t) => [t.id, t]),
)

export function TemplatePage() {
  const { templateId } = useParams<{ templateId: string }>()
  const template = templateId ? templateMap[templateId] : undefined
  if (!template) return <Navigate to="/" replace />
  return <TemplatePageInner template={template} />
}

function TemplatePageInner({ template }: { template: ChecklistTemplate }) {
  const navigate = useNavigate()
  const { entriesForTemplate, activeEntryForTemplate, createEntry } = useEntries()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState(`${template.title} — ${formatDateShort(todayISO())}`)
  const [newDate, setNewDate] = useState(todayISO())

  const entries = entriesForTemplate(template.id)
  const active = activeEntryForTemplate(template.id)
  const allTaskIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))

  const handleCreate = () => {
    const entry = createEntry(template, newTitle.trim() || template.title, newDate)
    setShowCreateModal(false)
    navigate(`/entry/${entry.id}`)
  }

  const handleContinueActive = () => {
    if (active) navigate(`/entry/${active.id}`)
  }

  return (
    <PageLayout>
      {/* Nav */}
      <div className="pt-4 mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5 -ml-2">
          <ArrowLeft size={16} />
          Inicio
        </Button>
      </div>

      {/* Template header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{template.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1c2b3a]">{template.title}</h1>
            <p className="text-[#888888] text-sm">{template.subtitle}</p>
          </div>
        </div>
        {template.description && (
          <p className="text-sm text-[#888888] mt-2">{template.description}</p>
        )}
      </div>

      {/* Active entry */}
      {active && (
        <div className="mb-6">
          <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-2">En progreso</p>
          <Card className="p-5 border-[#1c2b3a]/20 bg-[#1c2b3a]/[0.02]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold text-[#1c2b3a]">{active.title}</p>
                <p className="text-sm text-[#888888]">{formatDateShort(active.date)}</p>
              </div>
              <Badge variant="muted">
                <Clock size={11} />
                {Math.round(allTaskIds.filter((id) => active.checkedTasks[id]).length / allTaskIds.length * 100)}%
              </Badge>
            </div>
            <Progress
              value={Math.round(
                (allTaskIds.filter((id) => active.checkedTasks[id]).length / allTaskIds.length) * 100,
              )}
              className="mb-4"
            />
            <Button variant="primary" size="md" onClick={handleContinueActive} className="w-full justify-center">
              Continuar
            </Button>
          </Card>
        </div>
      )}

      {/* Create new entry */}
      <div className="mb-8">
        <Button
          variant={active ? 'secondary' : 'primary'}
          size="lg"
          onClick={() => {
            setNewTitle(`${template.title} — ${formatDateShort(todayISO())}`)
            setNewDate(todayISO())
            setShowCreateModal(true)
          }}
          className="w-full justify-center gap-2"
        >
          <Plus size={18} />
          Nueva entrada
        </Button>
      </div>

      {/* Recent history */}
      {entries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-[#888888] uppercase tracking-wider">Historial reciente</p>
            {entries.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/checklist/${template.id}/history`)}
                className="text-[#888888] gap-1"
              >
                <History size={13} />
                Ver todo ({entries.length})
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {entries.slice(0, 3).map((entry) => {
              const done = allTaskIds.filter((id) => entry.checkedTasks[id]).length
              const pct = Math.round((done / allTaskIds.length) * 100)
              return (
                <Card
                  key={entry.id}
                  hoverable
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  className="p-4"
                >
                  <div className="flex items-center gap-3">
                    {entry.status === 'completed' ? (
                      <CheckCircle2 size={18} className="text-[#3d7a5c] flex-shrink-0" />
                    ) : (
                      <Clock size={18} className="text-[#888888] flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1c2b3a] truncate">{entry.title}</p>
                      <p className="text-xs text-[#888888]">{formatDateShort(entry.date)}</p>
                    </div>
                    <Badge variant={entry.status === 'completed' ? 'success' : 'muted'}>
                      {pct}%
                    </Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && !active && (
        <div className="text-center py-12 text-[#888888]">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">Sin entradas aún</p>
          <p className="text-sm mt-1">Crea tu primera entrada para empezar.</p>
        </div>
      )}

      {/* Create modal */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nueva entrada">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Título</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm text-[#1c2b3a] bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
              placeholder={template.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Fecha</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm text-[#1c2b3a] bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!newDate}>
              Crear y abrir
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
