import { useState, useCallback } from 'react'
import type { ChecklistEntry, ChecklistTemplate } from '@/types/index'
import { loadEntries, saveEntry, deleteEntry } from '@/lib/storage'
import { generateId } from '@/lib/utils'

export function useEntries() {
  const [entries, setEntries] = useState<ChecklistEntry[]>(() => loadEntries())

  const refresh = useCallback(() => setEntries(loadEntries()), [])

  const createEntry = useCallback(
    (template: ChecklistTemplate, title: string, date: string): ChecklistEntry => {
      const now = new Date().toISOString()
      const entry: ChecklistEntry = {
        id: generateId(),
        templateId: template.id,
        title,
        date,
        createdAt: now,
        startedAt: now,
        status: 'in_progress',
        checkedTasks: {},
        notes: '',
      }
      saveEntry(entry)
      setEntries(loadEntries())
      return entry
    },
    [],
  )

  const duplicateEntry = useCallback(
    (source: ChecklistEntry, newTitle: string, newDate: string): ChecklistEntry => {
      const now = new Date().toISOString()
      const copy: ChecklistEntry = {
        ...source,
        id: generateId(),
        title: newTitle,
        date: newDate,
        createdAt: now,
        startedAt: now,
        completedAt: undefined,
        status: 'in_progress',
        checkedTasks: {},
        notes: '',
      }
      saveEntry(copy)
      setEntries(loadEntries())
      return copy
    },
    [],
  )

  const removeEntry = useCallback((id: string) => {
    deleteEntry(id)
    setEntries(loadEntries())
  }, [])

  const entriesForTemplate = useCallback(
    (templateId: string) =>
      entries
        .filter((e) => e.templateId === templateId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [entries],
  )

  const activeEntryForTemplate = useCallback(
    (templateId: string) =>
      entries.find((e) => e.templateId === templateId && e.status === 'in_progress'),
    [entries],
  )

  return {
    entries,
    refresh,
    createEntry,
    duplicateEntry,
    removeEntry,
    entriesForTemplate,
    activeEntryForTemplate,
  }
}
