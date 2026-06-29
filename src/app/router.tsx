import { createHashRouter, RouterProvider } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { TemplatePage } from '@/pages/TemplatePage'
import { EntryPage } from '@/pages/EntryPage'
import { EntryInspectionPage } from '@/pages/EntryInspectionPage'
import { EntryReportPage } from '@/pages/EntryReportPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { AdminPage } from '@/pages/AdminPage'
import { AdminTemplatePage } from '@/pages/AdminTemplatePage'
import { SettingsPage } from '@/pages/SettingsPage'

const router = createHashRouter([
  { path: '/', element: <HomePage /> },
  { path: '/checklist/:templateId', element: <TemplatePage /> },
  { path: '/checklist/:templateId/history', element: <HistoryPage /> },
  { path: '/entry/:entryId', element: <EntryPage /> },
  { path: '/entry/:entryId/inspect', element: <EntryInspectionPage /> },
  { path: '/entry/:entryId/report', element: <EntryReportPage /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/admin/template/:templateId', element: <AdminTemplatePage /> },
  { path: '/settings', element: <SettingsPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
