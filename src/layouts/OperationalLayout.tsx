import { Outlet } from 'react-router-dom'

function OperationalLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar - TODO: Extract to component */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <h2 className="text-xl font-bold text-primary-600">
              Admin Operativo
            </h2>
          </div>
          {/* Navigation will go here */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OperationalLayout
