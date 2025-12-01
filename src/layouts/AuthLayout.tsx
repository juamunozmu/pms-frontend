import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    // CAMBIO CLAVE: Cambiamos bg-gray-950 (negro puro) por bg-gray-900 (azul muy oscuro)
    <div className="min-h-screen flex items-center justify-center bg-gray-900 w-full">
      {/* Permitimos que el contenido ocupe todo el ancho disponible y lo centramos
          para que páginas como LoginPage puedan usar sus propias columnas */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout