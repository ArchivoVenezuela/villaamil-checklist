import { useState, useCallback, useEffect } from 'react'
import type { Checklist } from '@/types/checklist'
import {
  loadProgress,
  saveChecked,
  saveNotes,
  saveCompletedAt,
  ensureStartedAt,
  resetProgress,
} from '@/lib/storage'

export function useChecklistState(checklist: Checklist) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState('')
  const [startedAt, setStartedAt] = useState<string>('')
  const [completedAt, setCompletedAt] = useState<string | null>(null)

  // Load from storage on mount
  useEffect(() => {
    const progress = loadProgress(checklist.id)
    setChecked(progress.checked)
    setNotes(progress.notes)
    setCompletedAt(progress.completedAt)

    // Ensure startedAt is set
    const sa = ensureStartedAt(checklist.id)
    setStartedAt(sa)
  }, [checklist.id])

  const allTaskIds = checklist.sections.flatMap((s) => s.tasks.map((t) => t.id))
  const totalTasks = allTaskIds.length
  const checkedCount = allTaskIds.filter((id) => checked[id]).length
  const isComplete = totalTasks > 0 && checkedCount === totalTasks
  const progress = totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0

  // Auto-complete
  useEffect(() => {
    if (isComplete && !completedAt && startedAt) {
      const now = new Date().toISOString()
      setCompletedAt(now)
      saveCompletedAt(checklist.id, now)
    } else if (!isComplete && completedAt) {
      setCompletedAt(null)
      saveCompletedAt(checklist.id, null)
    }
  }, [isComplete, completedAt, startedAt, checklist.id])

  const toggleTask = useCallback(
    (taskId: string) => {
      setChecked((prev) => {
        const next = { ...prev, [taskId]: !prev[taskId] }
        saveChecked(checklist.id, next)
        return next
      })
    },
    [checklist.id],
  )

  const checkAll = useCallback(
    (taskIds: string[]) => {
      setChecked((prev) => {
        const next = { ...prev }
        taskIds.forEach((id) => {
          next[id] = true
        })
        saveChecked(checklist.id, next)
        return next
      })
    },
    [checklist.id],
  )

  const uncheckAll = useCallback(
    (taskIds: string[]) => {
      setChecked((prev) => {
        const next = { ...prev }
        taskIds.forEach((id) => {
          next[id] = false
        })
        saveChecked(checklist.id, next)
        return next
      })
    },
    [checklist.id],
  )

  const updateNotes = useCallback(
    (value: string) => {
      setNotes(value)
      saveNotes(checklist.id, value)
    },
    [checklist.id],
  )

  const reset = useCallback(() => {
    resetProgress(checklist.id)
    setChecked({})
    setNotes('')
    setCompletedAt(null)
    const now = new Date().toISOString()
    setStartedAt(now)
  }, [checklist.id])

  return {
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
  }
}
