import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useSettings } from '@/hooks/useSettings'
import { useEntries } from '@/hooks/useEntries'
import { BUILT_IN_TEMPLATES } from '@/hooks/useTemplates'
import { loadUserTemplates } from '@/lib/storage'
import { exportBackup } from '@/services/exportImport'
import { parseBackupFile } from '@/services/exportImport'
import { saveEntries, saveUserTemplates, saveSettings } from '@/lib/storage'
import { ArrowLeft, Download, Upload, Plus, X } from 'lucide-react'

export function SettingsPage() {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()
  const { entries, refresh } = useEntries()
  const [newRecipient, setNewRecipient] = useState('')
  const [importResult, setImportResult] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importPreview, setImportPreview] = useState<{ templates: number; entries: number } | null>(null)
  const [pendingBackup, setPendingBackup] = useState<string | null>(null)

  const addRecipient = () => {
    const email = newRecipient.trim()
    if (!email || settings.defaultRecipients.includes(email)) return
    updateSettings({ defaultRecipients: [...settings.defaultRecipients, email] })
    setNewRecipient('')
  }

  const removeRecipient = (email: string) => {
    updateSettings({ defaultRecipients: settings.defaultRecipients.filter((r) => r !== email) })
  }

  const handleExport = () => {
    const userTemplates = loadUserTemplates()
    exportBackup([...BUILT_IN_TEMPLATES, ...userTemplates], entries, settings)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const result = parseBackupFile(text)
      if (!result.valid || !result.backup) {
        setImportResult(result.error ?? 'Error desconocido')
        return
      }
      setPendingBackup(text)
      setImportPreview(result.summary ?? null)
      setShowImportModal(true)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImportConfirm = () => {
    if (!pendingBackup) return
    const result = parseBackupFile(pendingBackup)
    if (!result.valid || !result.backup) return
    const { backup } = result
    saveEntries(backup.entries)
    const userTemplates = backup.templates.filter((t) => !t.builtIn)
    saveUserTemplates(userTemplates)
    if (backup.settings) saveSettings(backup.settings)
    refresh()
    setShowImportModal(false)
    setPendingBackup(null)
    setImportResult(`Importado: ${backup.entries.length} entradas, ${userTemplates.length} plantillas personalizadas.`)
  }

  return (
    <PageLayout>
      <div className="pt-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="gap-1.5 -ml-2"
        >
          <ArrowLeft size={16} />
          Inicio
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1c2b3a]">Configuración</h1>
        <p className="text-[#888888] text-sm mt-1">Preferencias de la aplicación</p>
      </div>

      <div className="space-y-6">
        {/* Home name */}
        <Card className="p-5">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">Vivienda</h2>
          <div>
            <label className="text-sm font-medium text-[#1c2b3a] block mb-1">Nombre</label>
            <input
              type="text"
              value={settings.homeName}
              onChange={(e) => updateSettings({ homeName: e.target.value })}
              className="w-full border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
              placeholder="Villaamil"
            />
          </div>
        </Card>

        {/* Email recipients */}
        <Card className="p-5">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">
            Correos predeterminados
          </h2>
          <p className="text-xs text-[#888888] mb-3">
            Se usarán como destinatarios al enviar informes por correo.
          </p>

          {settings.defaultRecipients.map((email) => (
            <div key={email} className="flex items-center gap-2 mb-2">
              <span className="flex-1 text-sm text-[#1c2b3a] bg-[#f7f6f3] rounded-lg px-3 py-2">
                {email}
              </span>
              <button
                onClick={() => removeRecipient(email)}
                className="text-[#888888] hover:text-[#c0392b] transition-colors p-1"
                aria-label="Eliminar"
              >
                <X size={15} />
              </button>
            </div>
          ))}

          <div className="flex gap-2 mt-3">
            <input
              type="email"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
              placeholder="correo@ejemplo.com"
              className="flex-1 border border-[#e8e6e1] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20"
            />
            <Button variant="secondary" size="md" onClick={addRecipient} disabled={!newRecipient.trim()}>
              <Plus size={16} />
            </Button>
          </div>
        </Card>

        {/* Backup */}
        <Card className="p-5">
          <h2 className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-4">Copia de seguridad</h2>

          {importResult && (
            <p className="text-sm text-[#3d7a5c] bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-3">
              {importResult}
            </p>
          )}

          <div className="space-y-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleExport}
              className="w-full justify-center gap-2"
            >
              <Download size={16} />
              Exportar backup completo
            </Button>

            <label className="block">
              <div className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-xl border border-[#e8e6e1] bg-white text-[#1c2b3a] hover:bg-[#f7f6f3] cursor-pointer transition-colors">
                <Upload size={16} />
                Importar backup
              </div>
              <input type="file" accept=".json" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>

          <p className="text-xs text-[#888888] mt-3">
            El backup incluye todas las entradas y plantillas personalizadas.
          </p>
        </Card>

        <p className="text-center text-xs text-[#c0bdb8] pb-4">
          Villaamil Home Procedures v1.1 · Los datos se guardan localmente.
        </p>
      </div>

      {/* Import confirm modal */}
      <Modal
        open={showImportModal}
        onClose={() => { setShowImportModal(false); setPendingBackup(null) }}
        title="Confirmar importación"
      >
        <div className="space-y-4">
          {importPreview && (
            <div className="bg-[#f7f6f3] rounded-xl p-4 space-y-1">
              <p className="text-sm text-[#1c2b3a]">
                <strong>{importPreview.entries}</strong> entradas
              </p>
              <p className="text-sm text-[#1c2b3a]">
                <strong>{importPreview.templates}</strong> plantillas
              </p>
            </div>
          )}
          <p className="text-sm text-[#888888] leading-relaxed">
            Esto reemplazará todas las entradas y plantillas actuales. ¿Continuar?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => { setShowImportModal(false); setPendingBackup(null) }}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleImportConfirm}>
              Importar y reemplazar
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}
