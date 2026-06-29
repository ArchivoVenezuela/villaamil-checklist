import type { ChecklistProgress } from '@/types/checklist'

const PREFIX = 'villaamil-v2'

function key(checklistId: string, suffix: string) {
  return `${PREFIX}-${checklistId}-${suffix}`
}

export function loadProgress(checklistId: string): ChecklistProgress {
  const checked = JSON.parse(localStorage.getItem(key(checklistId, 'checked')) ?? '{}') as Record<
    string,
    boolean
  >
  const notes = localStorage.getItem(key(checklistId, 'notes')) ?? ''
  const startedAt = localStorage.getItem(key(checklistId, 'startedAt')) ?? new Date().toISOString()
  const completedAt = localStorage.getItem(key(checklistId, 'completedAt')) ?? null

  return { checklistId, checked, notes, startedAt, completedAt }
}

export function saveChecked(checklistId: string, checked: Record<string, boolean>) {
  localStorage.setItem(key(checklistId, 'checked'), JSON.stringify(checked))
}

export function saveNotes(checklistId: string, notes: string) {
  localStorage.setItem(key(checklistId, 'notes'), notes)
}

export function saveStartedAt(checklistId: string, startedAt: string) {
  localStorage.setItem(key(checklistId, 'startedAt'), startedAt)
}

export function saveCompletedAt(checklistId: string, completedAt: string | null) {
  if (completedAt) {
    localStorage.setItem(key(checklistId, 'completedAt'), completedAt)
  } else {
    localStorage.removeItem(key(checklistId, 'completedAt'))
  }
}

export function ensureStartedAt(checklistId: string): string {
  const existing = localStorage.getItem(key(checklistId, 'startedAt'))
  if (existing) return existing
  const now = new Date().toISOString()
  saveStartedAt(checklistId, now)
  return now
}

export function resetProgress(checklistId: string) {
  localStorage.removeItem(key(checklistId, 'checked'))
  localStorage.removeItem(key(checklistId, 'notes'))
  localStorage.removeItem(key(checklistId, 'startedAt'))
  localStorage.removeItem(key(checklistId, 'completedAt'))
}
