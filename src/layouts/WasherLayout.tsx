import React from 'react'
import { Outlet } from 'react-router-dom'
const UserMenu = React.lazy(() => import('@/components/UserMenu'))

function WasherLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        <header className="w-full bg-white shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-lg font-bold text-primary-600">PMS - Lavador</div>
            <div>
              <React.Suspense fallback={<div className="w-24 h-6 bg-gray-100 rounded" />}>
                <UserMenu />
              </React.Suspense>
            </div>
          </div>
        </header>

      <div className="flex">
        {/* Sidebar - TODO: Extract to component */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <h2 className="text-xl font-bold text-primary-600">Lavador</h2>
          </div>
          {/* Navigation will go here */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="w-full max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      </div>
    </div>
  )
}

export default WasherLayout
