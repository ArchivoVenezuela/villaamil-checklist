import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useTemplates } from '@/hooks/useTemplates'
import { ArrowLeft, Pencil, Copy, Lock } from 'lucide-react'

export function AdminPage() {
  const navigate = useNavigate()
  const { allTemplates, duplicateTemplate } = useTemplates()
  const [dupTarget, setDupTarget] = useState<string | null>(null)
  const [dupTitle, setDupTitle] = useState('')

  const handleDuplicate = () => {
    const template = allTemplates.find((t) => t.id === dupTarget)
    if (!template || !dupTitle.trim()) return
    const copy = duplicateTemplate(template, dupTitle.trim())
    setDupTarget(null)
    navigate(`/admin/template/${copy.id}`)
  }

  return (
    <PageLayout>
      <div className="pt-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1.5 -ml-2">
          <ArrowLeft size={16} />
          Inicio
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1c2b3a]">Administrar procedimientos</h1>
        <p className="text-[#888888] text-sm mt-1">Edita o duplica los procedimientos existentes.</p>
      </div>

      <div className="space-y-3">
        {allTemplates.map((template) => (
          <Card key={template.id} className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl leading-none flex-shrink-0">{template.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-[#1c2b3a]">{template.title}</h3>
                  {template.builtIn && (
                    <Badge variant="muted" className="text-[10px]">
                      <Lock size={9} /> Integrado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[#888888]">{template.subtitle}</p>
                <p className="text-xs text-[#888888] mt-1">
                  {template.sections.length} secciones ·{' '}
                  {template.sections.reduce((n, s) => n + s.tasks.length, 0)} tareas
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/admin/template/${template.id}`)}
                className="gap-1.5"
                disabled={template.builtIn}
                title={template.builtIn ? 'Los procedimientos integrados no se pueden editar directamente. Duplícalo primero.' : undefined}
              >
                <Pencil size={13} />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDupTitle(`${template.title} (copia)`)
                  setDupTarget(template.id)
                }}
                className="gap-1.5 text-[#888888]"
              >
                <Copy size={13} />
                Duplicar
              </Button>
            </div>
            {template.builtIn && (
              <p className="text-xs text-[#888888] mt-2">
                Para editar un procedimiento integrado, duplícalo primero.
              </p>
            )}
          </Card>
        ))}
      </div>

      <Modal
        open={!!dupTarget}
        onClose={() => setDupTarget(null)}
        title="Duplicar procedimiento"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Nombre del nuevo procedimiento</label>
            <input
              type="text"
              value={dupTitle}
              onChange={(e) => setDupTitle(e.target.value)}
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDupTarget(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleDuplicate} disabled={!dupTitle.trim()}>
              Duplicar y editar
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
