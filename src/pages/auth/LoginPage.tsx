function LoginPage() {
  return (
    <div className="card bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        PMS - Sistema de Parqueadero
      </h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="input-field w-full"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            className="input-field w-full"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Iniciar Sesión
        </button>
      </form>
      <div className="mt-4 text-center">
        <a
          href="/reset-password"
          className="text-sm text-primary-600 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </div>
  )
}

export default LoginPage
