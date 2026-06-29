import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import { useEntries } from '@/hooks/useEntries'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { exportEntry } from '@/services/exportImport'
import { formatDateShort, todayISO } from '@/lib/utils'
import { ArrowLeft, CheckCircle2, Clock, Trash2, Copy, FileText, Download } from 'lucide-react'
import type { ChecklistTemplate, ChecklistEntry } from '@/types/index'

const templateMap: Record<string, ChecklistTemplate> = Object.fromEntries(
  BUILT_IN_TEMPLATES.map((t) => [t.id, t]),
)

export function HistoryPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const template = templateId ? templateMap[templateId] : undefined
  if (!template) return <Navigate to="/" replace />
  return <HistoryInner template={template} />
}

function HistoryInner({ template }: { template: ChecklistTemplate }) {
  const navigate = useNavigate()
  const { entriesForTemplate, removeEntry, duplicateEntry } = useEntries()
  const [deleteTarget, setDeleteTarget] = useState<ChecklistEntry | null>(null)
  const [duplicateTarget, setDuplicateTarget] = useState<ChecklistEntry | null>(null)
  const [dupTitle, setDupTitle] = useState('')
  const [dupDate, setDupDate] = useState(todayISO())

  const entries = entriesForTemplate(template.id)
  const allTaskIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))

  const handleDuplicate = () => {
    if (!duplicateTarget) return
    const copy = duplicateEntry(duplicateTarget, dupTitle.trim() || duplicateTarget.title, dupDate)
    setDuplicateTarget(null)
    navigate(`/entry/${copy.id}`)
  }

  const handleOpenDuplicate = (entry: ChecklistEntry) => {
    setDupTitle(`${entry.title} (copia)`)
    setDupDate(todayISO())
    setDuplicateTarget(entry)
  }

  return (
    <PageLayout>
      <div className="pt-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/checklist/${template.id}`)}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{template.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1c2b3a]">Historial</h1>
            <p className="text-[#888888] text-sm">{template.title}</p>
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-[#888888]">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">Sin entradas</p>
          <p className="text-sm mt-1">Crea una nueva entrada para empezar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const done = allTaskIds.filter((id) => entry.checkedTasks[id]).length
            const pct = allTaskIds.length > 0 ? Math.round((done / allTaskIds.length) * 100) : 0

            return (
              <Card key={entry.id} className="p-5">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  role="button"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      {entry.status === 'completed' ? (
                        <CheckCircle2 size={18} className="text-[#3d7a5c] flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock size={18} className="text-[#888888] flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-[#1c2b3a] leading-tight">{entry.title}</p>
                        <p className="text-sm text-[#888888]">{formatDateShort(entry.date)}</p>
                      </div>
                    </div>
                    <Badge variant={entry.status === 'completed' ? 'success' : 'muted'}>
                      {pct}%
                    </Badge>
                  </div>
                  <Progress value={pct} size="sm" />
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/entry/${entry.id}/report`)}
                    className="gap-1.5 text-[#888888]"
                  >
                    <FileText size={13} />
                    Informe
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDuplicate(entry)}
                    className="gap-1.5 text-[#888888]"
                  >
                    <Copy size={13} />
                    Duplicar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => exportEntry(entry, template)}
                    className="gap-1.5 text-[#888888]"
                  >
                    <Download size={13} />
                    Exportar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(entry)}
                    className="gap-1.5 text-[#c0392b] ml-auto"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar entrada">
        <div className="space-y-4">
          <p className="text-sm text-[#888888] leading-relaxed">
            ¿Eliminar <strong className="text-[#1c2b3a]">{deleteTarget?.title}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTarget) removeEntry(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Duplicate modal */}
      <Modal open={!!duplicateTarget} onClose={() => setDuplicateTarget(null)} title="Duplicar entrada">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Título</label>
            <input
              type="text"
              value={dupTitle}
              onChange={(e) => setDupTitle(e.target.value)}
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Fecha</label>
            <input
              type="date"
              value={dupDate}
              onChange={(e) => setDupDate(e.target.value)}
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
            />
          </div>
          <p className="text-xs text-[#888888]">La nueva entrada empezará con todas las tareas desmarcadas.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDuplicateTarget(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleDuplicate} disabled={!dupDate}>
              Duplicar y abrir
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
