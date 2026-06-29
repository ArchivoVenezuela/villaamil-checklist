import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { ArrowLeft, FileText } from 'lucide-react'
import type { Checklist } from '@/types/checklist'

interface ChecklistHeaderProps {
  checklist: Checklist
  progress: number
  checkedCount: number
  totalTasks: number
  isComplete: boolean
}

export function ChecklistHeader({
  checklist,
  progress,
  checkedCount,
  totalTasks,
  isComplete,
}: ChecklistHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-10 bg-[#f7f6f3]/95 backdrop-blur-sm pt-4 pb-3 -mx-4 px-4 border-b border-[#e8e6e1] mb-4">
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft size={16} />
          Inicio
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/checklist/${checklist.id}/report`)}
          className="gap-1.5"
        >
          <FileText size={16} />
          Informe
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{checklist.icon}</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[#1c2b3a] leading-tight">{checklist.title}</h1>
          <p className="text-sm text-[#888888]">{checklist.subtitle}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#888888]">
            {checkedCount} de {totalTasks} tareas
          </span>
          <span className={isComplete ? 'text-[#3d7a5c] font-semibold' : 'text-[#1c2b3a] font-medium'}>
            {isComplete ? '¡Completado!' : `${progress}%`}
          </span>
        </div>
        <Progress value={progress} />
      </div>
    </div>
  )
}
