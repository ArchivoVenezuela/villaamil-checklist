import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { ChevronRight, Settings, Plus, CheckCircle2 } from 'lucide-react'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { useEntries } from '@/hooks/useEntries'
import { migrateStorageIfNeeded } from '@/lib/migration'

export function HomePage() {
  const navigate = useNavigate()
  const { entriesForTemplate, activeEntryForTemplate } = useEntries()

  useEffect(() => {
    migrateStorageIfNeeded(BUILT_IN_TEMPLATES)
  }, [])

  return (
    <PageLayout>
      {/* Header */}
      <div className="pt-10 pb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏠</span>
          <div>
            <h1 className="text-3xl font-bold text-[#1c2b3a] tracking-tight">Villaamil</h1>
            <p className="text-[#888888] text-sm mt-0.5">C/ Villaamil · Madrid</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} aria-label="Ajustes">
          <Settings size={18} />
        </Button>
      </div>

      {/* Template cards */}
      <div className="space-y-4">
        {BUILT_IN_TEMPLATES.map((template) => {
          const entries = entriesForTemplate(template.id)
          const active = activeEntryForTemplate(template.id)
          const lastCompleted = entries.find((e) => e.status === 'completed')
          const allTaskIds = template.sections.flatMap((s) => s.tasks.map((t) => t.id))
          const total = allTaskIds.length

          const displayEntry = active ?? lastCompleted
          const pct = displayEntry
            ? Math.round(
                (allTaskIds.filter((id) => displayEntry.checkedTasks[id]).length / total) * 100,
              )
            : 0

          return (
            <Card
              key={template.id}
              hoverable
              onClick={() => navigate(`/checklist/${template.id}`)}
              className="p-6"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl leading-none flex-shrink-0 mt-0.5">{template.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1c2b3a] leading-tight">
                        {template.title}
                      </h2>
                      <p className="text-sm text-[#888888] mt-0.5">{template.subtitle}</p>
                    </div>
                    <ChevronRight size={18} className="text-[#888888] flex-shrink-0 mt-1" />
                  </div>

                  {displayEntry ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#888888] truncate pr-2">{displayEntry.title}</span>
                        {displayEntry.status === 'completed' ? (
                          <Badge variant="success" className="flex-shrink-0">
                            <CheckCircle2 size={11} /> Completado
                          </Badge>
                        ) : (
                          <Badge variant="muted" className="flex-shrink-0">{pct}%</Badge>
                        )}
                      </div>
                      <Progress value={pct} />
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#888888]">
                      <Plus size={14} />
                      <span>Crear primera entrada · {total} tareas</span>
                    </div>
                  )}

                  {entries.length > 1 && (
                    <p className="mt-2 text-xs text-[#888888]">
                      {entries.length} entradas en el historial
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Admin link */}
      <div className="mt-10 text-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-[#888888]">
          Administrar procedimientos
        </Button>
      </div>

      <div className="mt-4 text-center text-xs text-[#c0bdb8] pb-4">
        Los datos se guardan localmente en este dispositivo.
      </div>
    </PageLayout>
  )
}
