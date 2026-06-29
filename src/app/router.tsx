import { createHashRouter, RouterProvider } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { ChecklistPage } from '@/pages/ChecklistPage'
import { InspectionPage } from '@/pages/InspectionPage'
import { ReportPage } from '@/pages/ReportPage'

const router = createHashRouter([
  { path: '/', element: <HomePage /> },
  { path: '/checklist/:id', element: <ChecklistPage /> },
  { path: '/checklist/:id/inspect', element: <InspectionPage /> },
  { path: '/checklist/:id/report', element: <ReportPage /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
