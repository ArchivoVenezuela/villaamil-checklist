import { useState, useCallback } from 'react'
import type { ChecklistTemplate } from '@/types/index'
import { loadUserTemplates, saveUserTemplate, deleteUserTemplate } from '@/lib/storage'
import { villaamilDeparture } from '@/checklists/villaamil-departure'
import { villaamilReturn } from '@/checklists/villaamil-return'
import { generateId } from '@/lib/utils'

export const BUILT_IN_TEMPLATES: ChecklistTemplate[] = [villaamilDeparture, villaamilReturn]

export function useTemplates() {
  const [userTemplates, setUserTemplates] = useState<ChecklistTemplate[]>(() => loadUserTemplates())

  const allTemplates = [
    ...BUILT_IN_TEMPLATES,
    ...userTemplates.filter((ut) => !BUILT_IN_TEMPLATES.some((bt) => bt.id === ut.id)),
  ]

  const getTemplate = useCallback(
    (id: string): ChecklistTemplate | undefined => allTemplates.find((t) => t.id === id),
    [userTemplates],
  )

  const updateTemplate = useCallback((template: ChecklistTemplate) => {
    const updated = { ...template, updatedAt: new Date().toISOString() }
    saveUserTemplate(updated)
    setUserTemplates(loadUserTemplates())
  }, [])

  const duplicateTemplate = useCallback((template: ChecklistTemplate, newTitle: string) => {
    const now = new Date().toISOString()
    const copy: ChecklistTemplate = {
      ...template,
      id: generateId(),
      title: newTitle,
      builtIn: false,
      createdAt: now,
      updatedAt: now,
    }
    saveUserTemplate(copy)
    setUserTemplates(loadUserTemplates())
    return copy
  }, [])

  const removeUserTemplate = useCallback((id: string) => {
    deleteUserTemplate(id)
    setUserTemplates(loadUserTemplates())
  }, [])

  return { allTemplates, userTemplates, getTemplate, updateTemplate, duplicateTemplate, removeUserTemplate }
}
