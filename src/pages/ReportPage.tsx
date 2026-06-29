import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { useChecklistState } from '@/features/checklists/hooks/useChecklistState'
import { villaamilDeparture } from '@/checklists/villaamil-departure'
import { villaamilReturn } from '@/checklists/villaamil-return'
import type { Checklist } from '@/types/checklist'
import { formatDateTime, formatDuration } from '@/lib/utils'
import { ArrowLeft, Printer, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

const checklistMap: Record<string, Checklist> = {
  departure: villaamilDeparture,
  return: villaamilReturn,
}

export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const checklist = id ? checklistMap[id] : undefined
  if (!checklist) return <Navigate to="/" replace />
  return <ReportPageInner checklist={checklist} />
}

function ReportPageInner({ checklist }: { checklist: Checklist }) {
  const navigate = useNavigate()
  const { checked, notes, startedAt, completedAt, checkedCount, totalTasks, progress, isComplete } =
    useChecklistState(checklist)

  const criticalTasks = checklist.sections.flatMap((s) => s.tasks.filter((t) => t.critical))
  const criticalDone = criticalTasks.filter((t) => checked[t.id])
  const criticalPending = criticalTasks.filter((t) => !checked[t.id])

  return (
    <PageLayout>
      {/* Nav */}
      <div className="pt-4 mb-6 flex items-center justify-between no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/checklist/${checklist.id}`)}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.print()}
          className="gap-1.5"
        >
          <Printer size={16} />
          Imprimir
        </Button>
      </div>

      {/* Report header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{checklist.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1c2b3a]">Informe de {checklist.title.toLowerCase()}</h1>
            <p className="text-sm text-[#888888]">{checklist.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Summary card */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4">
            Resumen
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Estado</span>
              <Badge variant={isComplete ? 'success' : 'muted'}>
                {isComplete ? (
                  <>
                    <CheckCircle2 size={12} /> Completado
                  </>
                ) : (
                  `${progress}% completado`
                )}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Tareas completadas</span>
              <span className="text-sm font-medium text-[#1c2b3a]">
                {checkedCount} / {totalTasks}
              </span>
            </div>
            <Progress value={progress} size="sm" />
            <div className="pt-1 flex items-center justify-between">
              <span className="text-sm text-[#888888]">Inicio</span>
              <span className="text-sm font-medium text-[#1c2b3a]">
                {startedAt ? formatDateTime(startedAt) : '—'}
              </span>
            </div>
            {completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Fin</span>
                <span className="text-sm font-medium text-[#1c2b3a]">
                  {formatDateTime(completedAt)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Duración</span>
              <span className="text-sm font-medium text-[#1c2b3a]">
                {startedAt ? formatDuration(startedAt, completedAt) : '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Critical tasks */}
        {criticalTasks.length > 0 && (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4">
              Tareas críticas
            </h2>
            <div className="space-y-2">
              {criticalDone.map((task) => (
                <div key={task.id} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-[#3d7a5c] flex-shrink-0" />
                  <span className="text-[#888888] line-through">{task.title}</span>
                </div>
              ))}
              {criticalPending.map((task) => (
                <div key={task.id} className="flex items-center gap-3 text-sm">
                  <XCircle size={16} className="text-[#c0392b] flex-shrink-0" />
                  <span className="text-[#1c2b3a] font-medium">{task.title}</span>
                  <AlertTriangle size={12} className="text-[#c0392b] flex-shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Section detail */}
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4">
            Detalle por sección
          </h2>
          <div className="space-y-5">
            {checklist.sections.map((section) => {
              const sectionDone = section.tasks.filter((t) => checked[t.id]).length
              const sectionTotal = section.tasks.length
              const sectionPct = Math.round((sectionDone / sectionTotal) * 100)
              const allSectionDone = sectionDone === sectionTotal
              return (
                <div key={section.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{section.icon}</span>
                    <h3 className="text-sm font-semibold text-[#1c2b3a]">{section.title}</h3>
                    <span className="text-xs text-[#888888] ml-auto">
                      {sectionDone}/{sectionTotal}
                    </span>
                  </div>
                  <Progress value={sectionPct} size="sm" />
                  <div className="mt-2 space-y-1">
                    {section.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-xs">
                        {checked[task.id] ? (
                          <CheckCircle2 size={13} className="text-[#3d7a5c] flex-shrink-0" />
                        ) : (
                          <XCircle size={13} className="text-[#c0392b] flex-shrink-0" />
                        )}
                        <span
                          className={
                            checked[task.id]
                              ? 'text-[#888888] line-through'
                              : 'text-[#1c2b3a]'
                          }
                        >
                          {task.title}
                        </span>
                        {task.critical && !checked[task.id] && (
                          <Badge variant="critical" className="ml-auto">crítica</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  {allSectionDone && (
                    <p className="text-xs text-[#3d7a5c] font-medium mt-1">
                      ✓ Sección completa
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Notes */}
        {notes && (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-3">
              {checklist.notesLabel}
            </h2>
            <p className="text-sm text-[#1c2b3a] leading-relaxed whitespace-pre-wrap">{notes}</p>
          </Card>
        )}
      </div>

      {/* Print footer */}
      <div className="mt-8 pt-4 border-t border-[#e8e6e1] text-xs text-[#c0bdb8] text-center">
        Villaamil Checklist · {startedAt ? new Date(startedAt).getFullYear() : new Date().getFullYear()}
      </div>
    </PageLayout>
  )
}
