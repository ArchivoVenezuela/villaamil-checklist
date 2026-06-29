import { useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Modal } from '@/components/ui/Modal'
import { useEntry } from '@/hooks/useEntry'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { useSettings } from '@/hooks/useSettings'
import { loadEntry } from '@/lib/storage'
import { formatDateTime, formatDateShort, formatDuration } from '@/lib/utils'
import { exportEntry } from '@/services/exportImport'
import { openMailtoReport, copyReportToClipboard } from '@/services/reportDelivery'
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Copy,
  Download,
} from 'lucide-react'
import type { ChecklistTemplate } from '@/types/index'

const templateMap: Record<string, ChecklistTemplate> = Object.fromEntries(
  BUILT_IN_TEMPLATES.map((t) => [t.id, t]),
)

export function EntryReportPage() {
  const { entryId } = useParams<{ entryId: string }>()
  const raw = entryId ? loadEntry(entryId) : undefined
  const template = raw ? templateMap[raw.templateId] : undefined
  if (!raw || !template) return <Navigate to="/" replace />
  return <ReportInner entryId={entryId!} template={template} />
}

function ReportInner({ entryId, template }: { entryId: string; template: ChecklistTemplate }) {
  const navigate = useNavigate()
  const { entry, checkedCount, totalTasks, progress, isComplete } = useEntry(entryId, template)
  const { settings } = useSettings()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [extraRecipient, setExtraRecipient] = useState('')
  const [copied, setCopied] = useState(false)

  if (!entry) return <Navigate to="/" replace />

  const criticalTasks = template.sections.flatMap((s) => s.tasks.filter((t) => t.critical))
  const criticalDone = criticalTasks.filter((t) => entry.checkedTasks[t.id])
  const criticalPending = criticalTasks.filter((t) => !entry.checkedTasks[t.id])

  const handleCopy = async () => {
    await copyReportToClipboard(entry, template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = () => {
    const recipients = [
      ...settings.defaultRecipients,
      ...extraRecipient.split(',').map((s) => s.trim()).filter(Boolean),
    ]
    openMailtoReport(entry, template, recipients)
    setShowEmailModal(false)
  }

  return (
    <PageLayout>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>

      {/* Nav */}
      <div className="pt-4 mb-6 flex items-center justify-between no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/entry/${entryId}`)}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft size={16} />
          Volver
        </Button>
        <Button variant="secondary" size="sm" onClick={() => window.print()} className="gap-1.5">
          <Printer size={16} />
          Imprimir
        </Button>
      </div>

      {/* Report header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{template.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1c2b3a]">{entry.title}</h1>
            <p className="text-sm text-[#888888]">{formatDateShort(entry.date)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Summary */}
        <Card className="p-5">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">Resumen</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Estado</span>
              <Badge variant={isComplete ? 'success' : 'muted'}>
                {isComplete ? <><CheckCircle2 size={12} /> Completado</> : `${progress}% completado`}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Tareas completadas</span>
              <span className="text-sm font-medium text-[#1c2b3a]">{checkedCount} / {totalTasks}</span>
            </div>
            <Progress value={progress} size="sm" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm text-[#888888]">Inicio</span>
              <span className="text-sm font-medium text-[#1c2b3a]">
                {entry.startedAt ? formatDateTime(entry.startedAt) : '—'}
              </span>
            </div>
            {entry.completedAt && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888888]">Fin</span>
                <span className="text-sm font-medium text-[#1c2b3a]">{formatDateTime(entry.completedAt)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#888888]">Duración</span>
              <span className="text-sm font-medium text-[#1c2b3a]">
                {entry.startedAt ? formatDuration(entry.startedAt, entry.completedAt) : '—'}
              </span>
            </div>
          </div>
        </Card>

        {/* Critical tasks */}
        {criticalTasks.length > 0 && (
          <Card className="p-5">
            <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">Tareas críticas</h2>
            <div className="space-y-2">
              {criticalDone.map((task) => (
                <div key={task.id} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-[#3d7a5c] flex-shrink-0" />
                  <span className="text-[#888888] line-through">{task.title}</span>
                </div>
              ))}
              {criticalPending.map((task) => (
                <div key={task.id} className="flex items-center gap-3 text-sm">
                  <XCircle size={16} className="text-[#c0392b] flex-shrink-0" />
                  <span className="text-[#1c2b3a] font-medium">{task.title}</span>
                  <AlertTriangle size={12} className="text-[#c0392b]" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Section detail */}
        <Card className="p-5">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">Detalle por sección</h2>
          <div className="space-y-5">
            {template.sections.map((section) => {
              const done = section.tasks.filter((t) => entry.checkedTasks[t.id]).length
              const pct = Math.round((done / section.tasks.length) * 100)
              return (
                <div key={section.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{section.icon}</span>
                    <h3 className="text-sm font-semibold text-[#1c2b3a]">{section.title}</h3>
                    <span className="text-xs text-[#888888] ml-auto">{done}/{section.tasks.length}</span>
                  </div>
                  <Progress value={pct} size="sm" />
                  <div className="mt-2 space-y-1">
                    {section.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-xs">
                        {entry.checkedTasks[task.id] ? (
                          <CheckCircle2 size={13} className="text-[#3d7a5c] flex-shrink-0" />
                        ) : (
                          <XCircle size={13} className="text-[#c0392b] flex-shrink-0" />
                        )}
                        <span className={entry.checkedTasks[task.id] ? 'text-[#888888] line-through' : 'text-[#1c2b3a]'}>
                          {task.title}
                        </span>
                        {task.critical && !entry.checkedTasks[task.id] && (
                          <Badge variant="critical" className="ml-auto">crítica</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Notes */}
        {entry.notes && (
          <Card className="p-5">
            <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-3">{template.notesLabel}</h2>
            <p className="text-sm text-[#1c2b3a] leading-relaxed whitespace-pre-wrap">{entry.notes}</p>
          </Card>
        )}

        {/* Actions */}
        <Card className="p-5 no-print">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">Exportar informe</h2>
          <div className="space-y-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopy}
              className="w-full justify-center gap-2"
            >
              <Copy size={16} />
              {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowEmailModal(true)}
              className="w-full justify-center gap-2"
            >
              <Mail size={16} />
              Enviar por correo
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => exportEntry(entry, template)}
              className="w-full justify-center gap-2"
            >
              <Download size={16} />
              Exportar JSON
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-8 pt-4 border-t border-[#e8e6e1] text-xs text-[#c0bdb8] text-center">
        Villaamil Home Procedures · {new Date(entry.date).getFullYear()}
      </div>

      {/* Email modal */}
      <Modal open={showEmailModal} onClose={() => setShowEmailModal(false)} title="Enviar informe por correo">
        <div className="space-y-4">
          {settings.defaultRecipients.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#888888] mb-2">Destinatarios predeterminados</p>
              {settings.defaultRecipients.map((r) => (
                <p key={r} className="text-sm text-[#1c2b3a] bg-[#f7f6f3] rounded-lg px-3 py-1.5 mb-1">{r}</p>
              ))}
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">
              Añadir destinatarios adicionales
            </label>
            <input
              type="email"
              value={extraRecipient}
              onChange={(e) => setExtraRecipient(e.target.value)}
              placeholder="correo@ejemplo.com, otro@ejemplo.com"
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
            />
          </div>
          <p className="text-xs text-[#888888]">
            Se abrirá tu cliente de correo con el informe prellenado.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              disabled={settings.defaultRecipients.length === 0 && !extraRecipient.trim()}
            >
              <Mail size={15} />
              Abrir correo
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
