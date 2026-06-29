import { useState } from 'react'
import { useParams, Navigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { ChecklistHeader } from '@/features/checklists/components/ChecklistHeader'
import { ChecklistToolbar } from '@/features/checklists/components/ChecklistToolbar'
import { SectionCard } from '@/features/checklists/components/SectionCard'
import { CompletionCard } from '@/features/checklists/components/CompletionCard'
import { NotesField } from '@/features/checklists/components/NotesField'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useChecklistState } from '@/features/checklists/hooks/useChecklistState'
import { villaamilDeparture } from '@/checklists/villaamil-departure'
import { villaamilReturn } from '@/checklists/villaamil-return'
import type { Checklist } from '@/types/checklist'

const checklistMap: Record<string, Checklist> = {
  departure: villaamilDeparture,
  return: villaamilReturn,
}

export function ChecklistPage() {
  const { id } = useParams<{ id: string }>()
  const [showResetModal, setShowResetModal] = useState(false)
  const [showOnlyCritical, setShowOnlyCritical] = useState(false)

  const checklist = id ? checklistMap[id] : undefined
  if (!checklist) return <Navigate to="/" replace />

  return <ChecklistPageInner checklist={checklist} showResetModal={showResetModal} setShowResetModal={setShowResetModal} showOnlyCritical={showOnlyCritical} setShowOnlyCritical={setShowOnlyCritical} />
}

interface InnerProps {
  checklist: Checklist
  showResetModal: boolean
  setShowResetModal: (v: boolean) => void
  showOnlyCritical: boolean
  setShowOnlyCritical: (v: boolean) => void
}

function ChecklistPageInner({ checklist, showResetModal, setShowResetModal, showOnlyCritical, setShowOnlyCritical }: InnerProps) {
  const {
    checked,
    notes,
    startedAt,
    completedAt,
    totalTasks,
    checkedCount,
    isComplete,
    progress,
    toggleTask,
    checkAll,
    uncheckAll,
    updateNotes,
    reset,
  } = useChecklistState(checklist)

  const allTaskIds = checklist.sections.flatMap((s) => s.tasks.map((t) => t.id))
  const pendingCount = allTaskIds.filter((id) => !checked[id]).length

  const handleReset = () => {
    reset()
    setShowResetModal(false)
  }

  return (
    <PageLayout>
      <ChecklistHeader
        checklist={checklist}
        progress={progress}
        checkedCount={checkedCount}
        totalTasks={totalTasks}
        isComplete={isComplete}
      />

      <div className="space-y-3 mt-2">
        {/* Toolbar */}
        <ChecklistToolbar
          checklist={checklist}
          showOnlyCritical={showOnlyCritical}
          onToggleCritical={() => setShowOnlyCritical(!showOnlyCritical)}
          onReset={() => setShowResetModal(true)}
          pendingCount={pendingCount}
        />

        {/* Completion banner */}
        {isComplete && startedAt && (
          <CompletionCard
            checklist={checklist}
            startedAt={startedAt}
            completedAt={completedAt}
          />
        )}

        {/* Sections */}
        {checklist.sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            checked={checked}
            showOnlyCritical={showOnlyCritical}
            onToggleTask={toggleTask}
            onCheckAll={checkAll}
            onUncheckAll={uncheckAll}
          />
        ))}

        {/* Notes */}
        <div className="pt-2">
          <NotesField checklist={checklist} value={notes} onChange={updateNotes} />
        </div>
      </div>

      {/* Reset modal */}
      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reiniciar checklist"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#888888] leading-relaxed">
            Se borrarán todas las tareas marcadas, las notas y los tiempos registrados.
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Sí, reiniciar
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
