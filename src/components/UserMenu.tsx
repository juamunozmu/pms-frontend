import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // `User` type may have `username` or `id`/`email` in token payload; we try username then id
  const username = (user as any)?.username || (user as any)?.email || 'Usuario';
  const userRole = (user as any)?.role || 'usuario';

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const handleLogout = () => {
    logout();
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Botón de usuario */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600">
            <User size={18} className="text-white" />
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="font-semibold text-sm leading-none">{username}</span>
            <span className="text-xs text-white/70 capitalize">{userRole}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Menú desplegable */}
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl text-gray-800 z-50 overflow-hidden">
            {/* Header del menú */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <p className="font-semibold text-gray-900">{username}</p>
              <p className="text-xs text-gray-600 capitalize">{userRole}</p>
            </div>

            {/* Opciones del menú */}
            <div className="py-2">
              <button
                onClick={() => {
                  setConfirmOpen(true);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 font-medium transition-colors duration-150"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-in fade-in scale-95">
            {/* Icono de alerta */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>

            {/* Contenido del modal */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Cerrar sesión
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              ¿Estás seguro que deseas cerrar tu sesión? Deberás volver a iniciar sesión para acceder al sistema.
            </p>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors duration-150"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-150"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
