import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { AlertTriangle, Info } from 'lucide-react'
import { useState } from 'react'
import type { Task } from '@/types/checklist'

interface TaskItemProps {
  task: Task
  checked: boolean
  onToggle: () => void
}

export function TaskItem({ task, checked, onToggle }: TaskItemProps) {
  const [showNote, setShowNote] = useState(false)

  return (
    <div
      className={cn(
        'group flex items-start gap-3 py-3 px-4 rounded-xl transition-all duration-150',
        checked ? 'bg-[#f7f6f3]' : 'bg-white hover:bg-[#faf9f7]',
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all duration-150',
          checked
            ? 'bg-[#3d7a5c] border-[#3d7a5c]'
            : 'border-[#c8c4bc] hover:border-[#1c2b3a]',
        )}
        aria-label={checked ? 'Desmarcar tarea' : 'Marcar tarea como hecha'}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              'text-sm leading-relaxed transition-colors',
              checked ? 'line-through text-[#888888]' : 'text-[#1c2b3a]',
            )}
          >
            {task.title}
          </span>
          {task.critical && !checked && (
            <Badge variant="critical">
              <AlertTriangle size={10} />
              crítica
            </Badge>
          )}
        </div>

        {task.note && (
          <div className="mt-1">
            <button
              onClick={() => setShowNote((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#888888] hover:text-[#1c2b3a] transition-colors"
            >
              <Info size={12} />
              {showNote ? 'Ocultar nota' : 'Ver nota'}
            </button>
            {showNote && (
              <p className="mt-1.5 text-xs text-[#888888] bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
                {task.note}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
