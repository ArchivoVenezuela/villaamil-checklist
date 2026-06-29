import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { SectionCard } from '@/features/checklists/components/SectionCard'
import { NotesField } from '@/features/checklists/components/NotesField'
import { useEntry } from '@/hooks/useEntry'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { loadEntry } from '@/lib/storage'
import { formatDateShort, formatDuration } from '@/lib/utils'
import { ArrowLeft, FileText, RotateCcw, ScanLine, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ChecklistTemplate } from '@/types/index'

const templateMap: Record<string, ChecklistTemplate> = Object.fromEntries(
  BUILT_IN_TEMPLATES.map((t) => [t.id, t]),
)

export function EntryPage() {
  const { entryId } = useParams<{ entryId: string }>()
  const raw = entryId ? loadEntry(entryId) : undefined
  const template = raw ? templateMap[raw.templateId] : undefined
  if (!raw || !template) return <Navigate to="/" replace />
  return <EntryPageInner entryId={entryId!} template={template} />
}

function EntryPageInner({ entryId, template }: { entryId: string; template: ChecklistTemplate }) {
  const navigate = useNavigate()
  const [showResetModal, setShowResetModal] = useState(false)
  const [showOnlyCritical, setShowOnlyCritical] = useState(false)

  const {
    entry,
    totalTasks,
    checkedCount,
    isComplete,
    progress,
    toggleTask,
    checkSection,
    uncheckSection,
    updateNotes,
    resetEntry,
  } = useEntry(entryId, template)

  if (!entry) return <Navigate to="/" replace />

  const allTaskIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))
  const pendingIds = allTaskIds.filter((id) => !entry.checkedTasks[id])
  const criticalTasks = template.sections.flatMap((s) => s.tasks.filter((t) => t.critical))
  const criticalDone = criticalTasks.filter((t) => entry.checkedTasks[t.id]).length

  const handleReset = () => {
    resetEntry()
    setShowResetModal(false)
  }

  return (
    <PageLayout>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#f7f6f3]/95 backdrop-blur-sm pt-4 pb-3 -mx-4 px-4 border-b border-[#e8e6e1] mb-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/checklist/${template.id}`)}
            className="gap-1.5 -ml-2"
          >
            <ArrowLeft size={16} />
            Volver
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/entry/${entryId}/report`)}
              className="gap-1.5"
            >
              <FileText size={16} />
              Informe
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResetModal(true)}
              className="gap-1.5 text-[#888888]"
              aria-label="Reiniciar"
            >
              <RotateCcw size={15} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{template.icon}</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#1c2b3a] leading-tight truncate">{entry.title}</h1>
            <p className="text-xs text-[#888888]">{formatDateShort(entry.date)}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#888888]">{checkedCount} de {totalTasks} tareas</span>
            <span className={isComplete ? 'text-[#3d7a5c] font-semibold' : 'text-[#1c2b3a] font-medium'}>
              {isComplete ? '¡Completado!' : `${progress}%`}
            </span>
          </div>
          <Progress value={progress} />
          {criticalTasks.length > 0 && (
            <p className="text-xs text-[#888888]">
              ⚠ Críticas: {criticalDone}/{criticalTasks.length}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={showOnlyCritical ? 'danger' : 'secondary'}
            size="sm"
            onClick={() => setShowOnlyCritical((v) => !v)}
            className="gap-1.5"
          >
            <AlertTriangle size={14} />
            {showOnlyCritical ? 'Ver todas' : `Críticas (${criticalTasks.length})`}
          </Button>
          {pendingIds.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/entry/${entryId}/inspect`)}
              className="gap-1.5"
            >
              <ScanLine size={14} />
              Inspeccionar
              <Badge variant="muted">{pendingIds.length}</Badge>
            </Button>
          )}
        </div>

        {/* Completion banner */}
        {isComplete && entry.startedAt && (
          <div className="bg-white rounded-2xl border border-[#3d7a5c]/30 p-6 text-center shadow-sm">
            <CheckCircle2 size={32} className="text-[#3d7a5c] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1c2b3a]">{template.completionMessage}</h3>
            <p className="text-sm text-[#888888] mt-1">
              Completado en {formatDuration(entry.startedAt, entry.completedAt)}
            </p>
            <Button
              variant="success"
              size="md"
              onClick={() => navigate(`/entry/${entryId}/report`)}
              className="mt-4 gap-2 justify-center"
            >
              <FileText size={16} />
              Ver informe completo
            </Button>
          </div>
        )}

        {/* Sections */}
        {template.sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            checked={entry.checkedTasks}
            showOnlyCritical={showOnlyCritical}
            onToggleTask={toggleTask}
            onCheckAll={checkSection}
            onUncheckAll={uncheckSection}
          />
        ))}

        {/* Notes */}
        <div className="pt-2">
          <NotesField checklist={template} value={entry.notes ?? ''} onChange={updateNotes} />
        </div>
      </div>

      {/* Reset modal */}
      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title="Reiniciar entrada">
        <div className="space-y-4">
          <p className="text-sm text-[#888888] leading-relaxed">
            Se borrarán todas las tareas marcadas y las notas. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleReset}>Sí, reiniciar</Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
