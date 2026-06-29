import { useState, useCallback } from 'react'
import type { AppSettings } from '@/types/index'
import { loadSettings, saveSettings } from '@/lib/storage'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    const next = { ...settings, ...updates }
    saveSettings(next)
    setSettings(next)
  }, [settings])

  return { settings, updateSettings }
}
