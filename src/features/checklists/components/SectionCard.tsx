import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { TaskItem } from './TaskItem'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Section } from '@/types/checklist'

interface SectionCardProps {
  section: Section
  checked: Record<string, boolean>
  showOnlyCritical: boolean
  onToggleTask: (id: string) => void
  onCheckAll: (ids: string[]) => void
  onUncheckAll: (ids: string[]) => void
}

export function SectionCard({
  section,
  checked,
  showOnlyCritical,
  onToggleTask,
  onCheckAll,
  onUncheckAll,
}: SectionCardProps) {
  const [collapsed, setCollapsed] = useState(false)

  const visibleTasks = showOnlyCritical
    ? section.tasks.filter((t) => t.critical)
    : section.tasks

  if (visibleTasks.length === 0) return null

  const taskIds = visibleTasks.map((t) => t.id)
  const doneCount = taskIds.filter((id) => checked[id]).length
  const total = taskIds.length
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const allDone = doneCount === total

  return (
    <Card className="overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center gap-3 p-4 hover:bg-[#faf9f7] transition-colors text-left"
      >
        <span className="text-2xl leading-none">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={cn('font-semibold', allDone ? 'text-[#3d7a5c]' : 'text-[#1c2b3a]')}>
              {section.title}
            </h3>
            <span className="text-sm text-[#888888] flex-shrink-0">
              {doneCount}/{total}
            </span>
          </div>
          <Progress value={pct} size="sm" className="mt-1.5" />
        </div>
        <div className="flex-shrink-0 text-[#888888]">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </button>

      {/* Tasks */}
      {!collapsed && (
        <>
          <div className="border-t border-[#e8e6e1] px-2 py-1">
            {visibleTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                checked={!!checked[task.id]}
                onToggle={() => onToggleTask(task.id)}
              />
            ))}
          </div>

          {/* Section actions */}
          <div className="border-t border-[#e8e6e1] px-4 py-3 flex items-center gap-2 bg-[#faf9f7]">
            {allDone ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUncheckAll(taskIds)}
                className="text-[#888888] text-xs"
              >
                Desmarcar sección
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCheckAll(taskIds)}
                className="text-[#3d7a5c] text-xs font-medium"
              >
                Marcar sección completa
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
