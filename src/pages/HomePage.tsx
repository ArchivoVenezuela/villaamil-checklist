import { PageLayout } from '@/components/layout/PageLayout'
import { ChecklistCard } from '@/features/checklists/components/ChecklistCard'
import { villaamilDeparture } from '@/checklists/villaamil-departure'
import { villaamilReturn } from '@/checklists/villaamil-return'

const checklists = [villaamilDeparture, villaamilReturn]

export function HomePage() {
  return (
    <PageLayout>
      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏠</span>
          <div>
            <h1 className="text-3xl font-bold text-[#1c2b3a] tracking-tight">Villaamil</h1>
            <p className="text-[#888888] text-sm mt-0.5">C/ Villaamil · Madrid</p>
          </div>
        </div>
        <p className="text-[#888888] text-sm mt-4 leading-relaxed max-w-md">
          Checklists de apertura y cierre del piso. Selecciona la lista que necesitas.
        </p>
      </div>

      {/* Checklist cards */}
      <div className="space-y-4">
        {checklists.map((checklist) => (
          <ChecklistCard key={checklist.id} checklist={checklist} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-[#c0bdb8]">
        Los datos se guardan localmente en este dispositivo.
      </div>
    </PageLayout>
  )
}
