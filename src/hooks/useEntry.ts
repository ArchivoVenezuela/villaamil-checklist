import { useState, useCallback, useEffect } from 'react'
import type { ChecklistEntry, ChecklistTemplate } from '@/types/index'
import { loadEntry, saveEntry } from '@/lib/storage'

function computeStatus(
  entry: ChecklistEntry,
  template: ChecklistTemplate,
): ChecklistEntry['status'] {
  const allIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))
  if (allIds.length === 0) return 'in_progress'
  const done = allIds.filter((id) => entry.checkedTasks[id]).length
  return done === allIds.length ? 'completed' : 'in_progress'
}

export function useEntry(entryId: string, template: ChecklistTemplate) {
  const [entry, setEntry] = useState<ChecklistEntry | null>(() => loadEntry(entryId) ?? null)

  useEffect(() => {
    const loaded = loadEntry(entryId)
    if (loaded) setEntry(loaded)
  }, [entryId])

  const allTaskIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))
  const totalTasks = allTaskIds.length
  const checkedCount = entry ? allTaskIds.filter((id) => entry.checkedTasks[id]).length : 0
  const isComplete = totalTasks > 0 && checkedCount === totalTasks
  const progress = totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0

  const persist = useCallback((updated: ChecklistEntry) => {
    saveEntry(updated)
    setEntry(updated)
  }, [])

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!entry) return
      const updated: ChecklistEntry = {
        ...entry,
        checkedTasks: { ...entry.checkedTasks, [taskId]: !entry.checkedTasks[taskId] },
      }
      // Auto-complete detection
      const allIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))
      const doneCount = allIds.filter((id) => updated.checkedTasks[id]).length
      if (doneCount === allIds.length && !updated.completedAt) {
        updated.completedAt = new Date().toISOString()
        updated.status = 'completed'
      } else if (doneCount < allIds.length && updated.completedAt) {
        updated.completedAt = undefined
        updated.status = 'in_progress'
      }
      persist(updated)
    },
    [entry, template, persist],
  )

  const checkSection = useCallback(
    (taskIds: string[]) => {
      if (!entry) return
      const next = { ...entry.checkedTasks }
      taskIds.forEach((id) => { next[id] = true })
      const updated = { ...entry, checkedTasks: next }
      updated.status = computeStatus(updated, template)
      if (updated.status === 'completed' && !updated.completedAt) {
        updated.completedAt = new Date().toISOString()
      }
      persist(updated)
    },
    [entry, template, persist],
  )

  const uncheckSection = useCallback(
    (taskIds: string[]) => {
      if (!entry) return
      const next = { ...entry.checkedTasks }
      taskIds.forEach((id) => { next[id] = false })
      const updated = { ...entry, checkedTasks: next, status: 'in_progress' as const, completedAt: undefined }
      persist(updated)
    },
    [entry, persist],
  )

  const updateNotes = useCallback(
    (notes: string) => {
      if (!entry) return
      persist({ ...entry, notes })
    },
    [entry, persist],
  )

  const resetEntry = useCallback(() => {
    if (!entry) return
    const now = new Date().toISOString()
    persist({
      ...entry,
      checkedTasks: {},
      notes: '',
      startedAt: now,
      completedAt: undefined,
      status: 'in_progress',
    })
  }, [entry, persist])

  return {
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
  }
}
