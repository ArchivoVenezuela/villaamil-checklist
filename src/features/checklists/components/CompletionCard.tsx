import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, FileText } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Checklist } from '@/types/checklist'

interface CompletionCardProps {
  checklist: Checklist
  startedAt: string
  completedAt: string | null
}

export function CompletionCard({ checklist, startedAt, completedAt }: CompletionCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="p-6 border-[#3d7a5c]/30 bg-gradient-to-br from-white to-green-50/30">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#3d7a5c]/10 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-[#3d7a5c]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#1c2b3a]">{checklist.completionMessage}</h3>
          <p className="text-sm text-[#888888] mt-1">
            Completado en {formatDuration(startedAt, completedAt)}
          </p>
        </div>
        <Button
          variant="success"
          size="md"
          onClick={() => navigate(`/checklist/${checklist.id}/report`)}
          className="gap-2"
        >
          <FileText size={16} />
          Ver informe completo
        </Button>
      </div>
    </Card>
  )
}
