import type { ChecklistEntry, ChecklistTemplate } from '@/types/index'
import { formatDateTime, formatDuration } from '@/lib/utils'

export function buildEmailSubject(entry: ChecklistEntry, _template: ChecklistTemplate): string {
  return `Informe Villaamil — ${entry.title} — ${formatDateShort(entry.date)}`
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function buildEmailBody(entry: ChecklistEntry, template: ChecklistTemplate): string {
  const allTasks = template.sections.flatMap((s) => s.tasks)
  const checkedCount = allTasks.filter((t) => entry.checkedTasks[t.id]).length
  const pct = allTasks.length > 0 ? Math.round((checkedCount / allTasks.length) * 100) : 0

  const criticalTasks = allTasks.filter((t) => t.critical)
  const criticalDone = criticalTasks.filter((t) => entry.checkedTasks[t.id])
  const criticalPending = criticalTasks.filter((t) => !entry.checkedTasks[t.id])

  const lines: string[] = [
    `INFORME — ${entry.title}`,
    `${'─'.repeat(40)}`,
    '',
    `Procedimiento: ${template.title}`,
    `Fecha: ${formatDateShort(entry.date)}`,
    `Inicio: ${entry.startedAt ? formatDateTime(entry.startedAt) : '—'}`,
    `Fin: ${entry.completedAt ? formatDateTime(entry.completedAt) : '—'}`,
    `Duración: ${entry.startedAt ? formatDuration(entry.startedAt, entry.completedAt) : '—'}`,
    `Estado: ${entry.status === 'completed' ? 'Completado' : 'En progreso'}`,
    `Completado: ${checkedCount} / ${allTasks.length} (${pct}%)`,
    '',
  ]

  if (criticalTasks.length > 0) {
    lines.push(`TAREAS CRÍTICAS (${criticalDone.length}/${criticalTasks.length})`)
    lines.push('─'.repeat(30))
    for (const t of criticalDone) {
      lines.push(`  ✓ ${t.title}`)
    }
    for (const t of criticalPending) {
      lines.push(`  ✗ ${t.title} ← PENDIENTE`)
    }
    lines.push('')
  }

  if (entry.notes) {
    lines.push('NOTAS')
    lines.push('─'.repeat(30))
    lines.push(entry.notes)
    lines.push('')
  }

  lines.push('DETALLE POR SECCIÓN')
  lines.push('─'.repeat(30))
  for (const section of template.sections) {
    const done = section.tasks.filter((t) => entry.checkedTasks[t.id]).length
    lines.push(`\n${section.icon} ${section.title} (${done}/${section.tasks.length})`)
    for (const task of section.tasks) {
      const mark = entry.checkedTasks[task.id] ? '✓' : '✗'
      const crit = task.critical ? ' ⚠' : ''
      lines.push(`  ${mark} ${task.title}${crit}`)
    }
  }

  lines.push('')
  lines.push('─'.repeat(40))
  lines.push('Generado con Villaamil Home Procedures')

  return lines.join('\n')
}

export function openMailtoReport(
  entry: ChecklistEntry,
  template: ChecklistTemplate,
  recipients: string[],
) {
  const subject = encodeURIComponent(buildEmailSubject(entry, template))
  const body = encodeURIComponent(buildEmailBody(entry, template))
  const to = recipients.join(',')
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
}

export async function copyReportToClipboard(
  entry: ChecklistEntry,
  template: ChecklistTemplate,
): Promise<void> {
  const text = `${buildEmailSubject(entry, template)}\n\n${buildEmailBody(entry, template)}`
  await navigator.clipboard.writeText(text)
}
