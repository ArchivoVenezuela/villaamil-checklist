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
