import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AlertTriangle, RotateCcw, ScanLine } from 'lucide-react'
import type { Checklist } from '@/types/checklist'

interface ChecklistToolbarProps {
  checklist: Checklist
  showOnlyCritical: boolean
  onToggleCritical: () => void
  onReset: () => void
  pendingCount: number
}

export function ChecklistToolbar({
  checklist,
  showOnlyCritical,
  onToggleCritical,
  onReset,
  pendingCount,
}: ChecklistToolbarProps) {
  const navigate = useNavigate()
  const criticalTotal = checklist.sections.flatMap((s) => s.tasks.filter((t) => t.critical)).length

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={showOnlyCritical ? 'danger' : 'secondary'}
        size="sm"
        onClick={onToggleCritical}
        className="gap-1.5"
      >
        <AlertTriangle size={14} />
        {showOnlyCritical ? 'Ver todas' : `Críticas (${criticalTotal})`}
      </Button>

      {pendingCount > 0 && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/checklist/${checklist.id}/inspect`)}
          className="gap-1.5"
        >
          <ScanLine size={14} />
          Inspeccionar
          <Badge variant="muted">{pendingCount}</Badge>
        </Button>
      )}

      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1.5 text-[#888888]"
        >
          <RotateCcw size={14} />
          Reiniciar
        </Button>
      </div>
    </div>
  )
}
