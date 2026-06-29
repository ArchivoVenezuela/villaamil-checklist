import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
import type { Checklist } from '@/types/checklist'
import { loadProgress } from '@/lib/storage'

interface ChecklistCardProps {
  checklist: Checklist
}

export function ChecklistCard({ checklist }: ChecklistCardProps) {
  const navigate = useNavigate()
  const progress = loadProgress(checklist.id)

  const allTaskIds = checklist.sections.flatMap((s) => s.tasks.map((t) => t.id))
  const total = allTaskIds.length
  const done = allTaskIds.filter((id) => progress.checked[id]).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = done === total && total > 0
  const hasStarted = done > 0

  const criticalTasks = checklist.sections.flatMap((s) =>
    s.tasks.filter((t) => t.critical),
  )
  const criticalDone = criticalTasks.filter((t) => progress.checked[t.id]).length

  return (
    <Card
      hoverable
      onClick={() => navigate(`/checklist/${checklist.id}`)}
      className="p-6"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none flex-shrink-0 mt-0.5">{checklist.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-[#1c2b3a] leading-tight">
                {checklist.title}
              </h2>
              <p className="text-sm text-[#888888] mt-0.5">{checklist.subtitle}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isComplete && (
                <Badge variant="success">
                  <CheckCircle2 size={12} />
                  Completado
                </Badge>
              )}
              <ChevronRight size={18} className="text-[#888888]" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#888888]">
                {hasStarted ? `${done} de ${total} tareas` : `${total} tareas`}
              </span>
              <span className="font-medium text-[#1c2b3a]">{pct}%</span>
            </div>
            <Progress value={pct} />
          </div>

          {criticalTasks.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="critical">
                {criticalDone}/{criticalTasks.length} críticas
              </Badge>
              {!hasStarted && (
                <span className="text-xs text-[#888888]">
                  {checklist.sections.length} secciones
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
