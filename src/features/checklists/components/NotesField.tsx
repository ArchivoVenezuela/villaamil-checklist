interface NotesFieldProps {
  checklist: { notesLabel: string; notesPlaceholder: string }
  value: string
  onChange: (val: string) => void
}

export function NotesField({ checklist, value, onChange }: NotesFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#1c2b3a]">{checklist.notesLabel}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={checklist.notesPlaceholder}
        rows={4}
        className="w-full bg-white border border-[#e8e6e1] rounded-xl px-4 py-3 text-sm text-[#1c2b3a] placeholder:text-[#c0bdb8] resize-none focus:outline-none focus:ring-2 focus:ring-[#1c2b3a]/20 focus:border-[#1c2b3a] transition-colors leading-relaxed"
      />
    </div>
  )
}
