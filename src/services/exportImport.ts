import type { AppBackup, ChecklistEntry, ChecklistTemplate, AppSettings } from '@/types/index'

export function buildBackup(
  templates: ChecklistTemplate[],
  entries: ChecklistEntry[],
  settings: AppSettings,
): AppBackup {
  return {
    app: 'villaamil-home-procedures',
    version: '1.1',
    exportedAt: new Date().toISOString(),
    templates,
    entries,
    settings,
  }
}

export function downloadJSON(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportBackup(
  templates: ChecklistTemplate[],
  entries: ChecklistEntry[],
  settings: AppSettings,
) {
  const backup = buildBackup(templates, entries, settings)
  const date = new Date().toISOString().split('T')[0]
  downloadJSON(backup, `villaamil-backup-${date}.json`)
}

export function exportEntry(entry: ChecklistEntry, template: ChecklistTemplate) {
  downloadJSON(
    { app: 'villaamil-home-procedures', version: '1.1', exportedAt: new Date().toISOString(), entry, template },
    `villaamil-entrada-${entry.date}-${entry.id.slice(0, 6)}.json`,
  )
}

export interface ImportResult {
  valid: boolean
  error?: string
  backup?: AppBackup
  summary?: {
    templates: number
    entries: number
  }
}

export function parseBackupFile(json: string): ImportResult {
  try {
    const data = JSON.parse(json) as Record<string, unknown>
    if (data.app !== 'villaamil-home-procedures') {
      return { valid: false, error: 'El archivo no es un backup de Villaamil.' }
    }
    if (!Array.isArray(data.templates) || !Array.isArray(data.entries)) {
      return { valid: false, error: 'El archivo no tiene el formato correcto.' }
    }
    const backup = data as unknown as AppBackup
    return {
      valid: true,
      backup,
      summary: {
        templates: backup.templates.length,
        entries: backup.entries.length,
      },
    }
  } catch {
    return { valid: false, error: 'No se pudo leer el archivo. ¿Es un JSON válido?' }
  }
}
