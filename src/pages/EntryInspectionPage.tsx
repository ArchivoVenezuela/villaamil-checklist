import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Card } from '@/components/ui/Card'
import { useEntry } from '@/hooks/useEntry'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { loadEntry } from '@/lib/storage'
import { ArrowLeft, CheckCircle2, AlertTriangle, SkipForward, Info } from 'lucide-react'
import type { ChecklistTemplate, ChecklistTask } from '@/types/index'

const templateMap: Record<string, ChecklistTemplate> = Object.fromEntries(
  BUILT_IN_TEMPLATES.map((t) => [t.id, t]),
)

export function EntryInspectionPage() {
  const { entryId } = useParams<{ entryId: string }>()
  const raw = entryId ? loadEntry(entryId) : undefined
  const template = raw ? templateMap[raw.templateId] : undefined
  if (!raw || !template) return <Navigate to="/" replace />
  return <InspectionInner entryId={entryId!} template={template} />
}

function InspectionInner({ entryId, template }: { entryId: string; template: ChecklistTemplate }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showNote, setShowNote] = useState(false)

  const { entry, toggleTask, checkedCount, totalTasks, progress, isComplete } = useEntry(
    entryId,
    template,
  )

  const allTasks: Array<{ task: ChecklistTask; sectionTitle: string }> =
    template.sections.flatMap((s) =>
      s.tasks
        .filter((t) => !entry?.checkedTasks[t.id])
        .map((t) => ({ task: t, sectionTitle: s.title })),
    )

  const safeIndex = Math.min(currentIndex, Math.max(0, allTasks.length - 1))
  const current = allTasks[safeIndex]

  const handleDone = () => {
    if (!current) return
    toggleTask(current.task.id)
    setShowNote(false)
    if (currentIndex >= allTasks.length - 1) {
      setCurrentIndex(Math.max(0, allTasks.length - 2))
    }
  }

  if (isComplete || allTasks.length === 0) {
    return (
      <PageLayout>
        <div className="pt-12 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#3d7a5c]/10 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[#3d7a5c]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1c2b3a]">Todo completado</h2>
            <p className="text-[#888888] mt-2">{template.completionMessage}</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button variant="secondary" onClick={() => navigate(`/entry/${entryId}`)}>
              Ver checklist
            </Button>
            <Button variant="primary" onClick={() => navigate(`/entry/${entryId}/report`)}>
              Ver informe
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="pt-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/entry/${entryId}`)}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1c2b3a]">Modo inspección</h1>
        <p className="text-[#888888] text-sm mt-1">{template.title}</p>
      </div>

      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#888888]">{checkedCount} de {totalTasks} completadas</span>
          <span className="font-medium text-[#1c2b3a]">{progress}%</span>
        </div>
        <Progress value={progress} />
        <p className="text-xs text-[#888888]">
          {allTasks.length} tarea{allTasks.length !== 1 ? 's' : ''} pendiente{allTasks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {current && (
        <Card className="p-6 mb-6">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="muted">{current.sectionTitle}</Badge>
            {current.task.critical && (
              <Badge variant="critical" className="gap-1">
                <AlertTriangle size={10} /> crítica
              </Badge>
            )}
          </div>

          <p className="text-xs text-[#888888] mb-2">
            {safeIndex + 1} de {allTasks.length} pendientes
          </p>

          <h2 className="text-xl font-semibold text-[#1c2b3a] leading-snug mb-4">
            {current.task.title}
          </h2>

          {current.task.note && (
            <div className="mb-4">
              <button
                onClick={() => setShowNote((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#1c2b3a] transition-colors"
              >
                <Info size={14} />
                {showNote ? 'Ocultar nota' : 'Ver nota'}
              </button>
              {showNote && (
                <p className="mt-2 text-sm text-[#888888] bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 leading-relaxed">
                  {current.task.note}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              variant="success"
              size="lg"
              onClick={handleDone}
              className="flex-1 justify-center"
            >
              <CheckCircle2 size={18} />
              Hecho
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => { setShowNote(false); setCurrentIndex((i) => Math.min(i + 1, allTasks.length - 1)) }}
              disabled={safeIndex >= allTasks.length - 1}
            >
              <SkipForward size={18} />
              Saltar
            </Button>
          </div>
        </Card>
      )}

      {allTasks.length > 1 && (
        <div>
          <p className="text-xs font-medium text-[#888888] uppercase tracking-wider mb-2">
            A continuación
          </p>
          <div className="space-y-1">
            {allTasks.slice(safeIndex + 1, safeIndex + 4).map((item, i) => (
              <div
                key={item.task.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#888888]"
                style={{ opacity: 1 - i * 0.25 }}
              >
                <span className="w-5 h-5 rounded-full border border-[#c8c4bc] flex-shrink-0" />
                <span className="truncate">{item.task.title}</span>
                {item.task.critical && (
                  <AlertTriangle size={12} className="text-[#c0392b] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
