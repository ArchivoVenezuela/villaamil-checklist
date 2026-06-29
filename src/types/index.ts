// Core data types for Villaamil v1.1

export interface ChecklistTask {
  id: string
  title: string
  note?: string
  critical?: boolean
  estimatedMinutes?: number
  order: number
}

export interface ChecklistSection {
  id: string
  title: string
  icon: string
  order: number
  tasks: ChecklistTask[]
}

export interface ChecklistTemplate {
  id: string
  title: string
  subtitle: string
  description?: string
  icon: string
  completionMessage: string
  notesLabel: string
  notesPlaceholder: string
  sections: ChecklistSection[]
  createdAt: string
  updatedAt: string
  builtIn?: boolean
}

export type EntryStatus = 'draft' | 'in_progress' | 'completed'

export interface ChecklistEntry {
  id: string
  templateId: string
  title: string
  date: string // ISO date string YYYY-MM-DD
  createdAt: string
  startedAt?: string
  completedAt?: string
  status: EntryStatus
  checkedTasks: Record<string, boolean>
  notes?: string
}

export interface AppSettings {
  homeName: string
  defaultRecipients: string[]
  language: 'es'
}

export interface AppBackup {
  app: 'villaamil-home-procedures'
  version: '1.1'
  exportedAt: string
  templates: ChecklistTemplate[]
  entries: ChecklistEntry[]
  settings: AppSettings
}

// Legacy types kept for migration compatibility
export interface Task {
  id: string
  title: string
  note?: string
  critical?: boolean
  estimatedMinutes?: number
}

export interface Section {
  id: string
  title: string
  icon: string
  order: number
  tasks: Task[]
}

export interface Checklist {
  id: string
  title: string
  subtitle: string
  description?: string
  icon: string
  completionMessage: string
  notesLabel: string
  notesPlaceholder: string
  sections: Section[]
}

export interface ChecklistProgress {
  checklistId: string
  checked: Record<string, boolean>
  notes: string
  startedAt: string
  completedAt: string | null
}
