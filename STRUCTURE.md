# PMS Frontend - Estructura del Proyecto

## 📁 Arquitectura de Carpetas

Este proyecto sigue una arquitectura **Feature-Based** con separación clara de responsabilidades.

```
pms-frontend/
├── public/                  # Archivos estáticos públicos
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
│
├── src/
│   ├── assets/              # Recursos estáticos (imágenes, iconos, fuentes)
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/          # 🧩 Componentes reutilizables
│   │   ├── common/          # Componentes comunes transversales
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   ├── Alert/
│   │   │   ├── Notification/
│   │   │   └── ...
│   │   ├── forms/           # Componentes de formularios
│   │   │   ├── FormField/
│   │   │   ├── Select/
│   │   │   ├── DatePicker/
│   │   │   ├── TimePicker/
│   │   │   └── FileUpload/
│   │   ├── tables/          # Componentes de tablas
│   │   │   ├── DataTable/
│   │   │   ├── Pagination/
│   │   │   └── SortableHeader/
│   │   ├── charts/          # Componentes de gráficos (Recharts)
│   │   │   ├── LineChart/
│   │   │   ├── BarChart/
│   │   │   ├── PieChart/
│   │   │   └── AreaChart/
│   │   └── modals/          # Componentes de modales
│   │       ├── ConfirmModal/
│   │       ├── FormModal/
│   │       └── InfoModal/
│   │
│   ├── features/            # 🎯 Módulos por funcionalidad (Feature-Based)
│   │   ├── auth/            # Autenticación
│   │   │   ├── components/  # Componentes específicos de auth
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── PasswordRecoveryForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   ├── hooks/       # Custom hooks de auth
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── services/    # API calls de auth
│   │   │   │   └── authService.ts
│   │   │   ├── types/       # Types específicos de auth
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── parking/         # Gestión de parqueadero
│   │   │   ├── components/
│   │   │   │   ├── VehicleEntryForm.tsx
│   │   │   │   ├── VehicleExitForm.tsx
│   │   │   │   ├── ActiveParkingList.tsx
│   │   │   │   └── ParkingOccupancy.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useParking.ts
│   │   │   │   └── useVehicleEntry.ts
│   │   │   ├── services/
│   │   │   │   └── parkingService.ts
│   │   │   └── types/
│   │   │       └── parking.types.ts
│   │   │
│   │   ├── washing/         # Gestión de lavados
│   │   │   ├── components/
│   │   │   │   ├── ServiceForm.tsx
│   │   │   │   ├── WasherAssignment.tsx
│   │   │   │   ├── ServiceStatusCard.tsx
│   │   │   │   └── ActiveServicesList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useWashing.ts
│   │   │   │   └── useWasherAssignment.ts
│   │   │   ├── services/
│   │   │   │   └── washingService.ts
│   │   │   └── types/
│   │   │       └── washing.types.ts
│   │   │
│   │   ├── shifts/          # Gestión de turnos
│   │   │   ├── components/
│   │   │   │   ├── ShiftSummary.tsx
│   │   │   │   ├── ShiftReport.tsx
│   │   │   │   └── CloseShiftModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useShift.ts
│   │   │   ├── services/
│   │   │   │   └── shiftService.ts
│   │   │   └── types/
│   │   │       └── shift.types.ts
│   │   │
│   │   ├── expenses/        # Gestión de gastos
│   │   │   ├── components/
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   └── ExpenseCategories.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useExpenses.ts
│   │   │   ├── services/
│   │   │   │   └── expenseService.ts
│   │   │   └── types/
│   │   │       └── expense.types.ts
│   │   │
│   │   ├── bonuses/         # Bonos de lavadores
│   │   │   ├── components/
│   │   │   │   ├── BonusSummary.tsx
│   │   │   │   ├── WasherBonusCard.tsx
│   │   │   │   └── VoucherManagement.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useBonuses.ts
│   │   │   ├── services/
│   │   │   │   └── bonusService.ts
│   │   │   └── types/
│   │   │       └── bonus.types.ts
│   │   │
│   │   ├── rates/           # Tarifas y configuración
│   │   │   ├── components/
│   │   │   │   ├── RatesTable.tsx
│   │   │   │   ├── RateForm.tsx
│   │   │   │   └── GlobalAdjustment.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useRates.ts
│   │   │   ├── services/
│   │   │   │   └── rateService.ts
│   │   │   └── types/
│   │   │       └── rate.types.ts
│   │   │
│   │   ├── subscriptions/   # Mensualidades
│   │   │   ├── components/
│   │   │   │   ├── SubscriptionForm.tsx
│   │   │   │   ├── SubscriptionList.tsx
│   │   │   │   └── ExpiringAlerts.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useSubscriptions.ts
│   │   │   ├── services/
│   │   │   │   └── subscriptionService.ts
│   │   │   └── types/
│   │   │       └── subscription.types.ts
│   │   │
│   │   ├── agreements/      # Convenios empresariales
│   │   │   ├── components/
│   │   │   │   ├── AgreementForm.tsx
│   │   │   │   ├── FleetImport.tsx
│   │   │   │   ├── AgreementList.tsx
│   │   │   │   └── AgreementReport.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAgreements.ts
│   │   │   ├── services/
│   │   │   │   └── agreementService.ts
│   │   │   └── types/
│   │   │       └── agreement.types.ts
│   │   │
│   │   ├── reports/         # Reportes
│   │   │   ├── components/
│   │   │   │   ├── ReportFilters.tsx
│   │   │   │   ├── ReportTable.tsx
│   │   │   │   ├── ExportButtons.tsx
│   │   │   │   └── ShiftReport.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useReports.ts
│   │   │   ├── services/
│   │   │   │   └── reportService.ts
│   │   │   └── types/
│   │   │       └── report.types.ts
│   │   │
│   │   ├── dashboard/       # Dashboard y analítica
│   │   │   ├── components/
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   ├── OccupancyChart.tsx
│   │   │   │   ├── IncomeChart.tsx
│   │   │   │   ├── WasherPerformance.tsx
│   │   │   │   └── RecentActivity.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboard.ts
│   │   │   ├── services/
│   │   │   │   └── analyticsService.ts
│   │   │   └── types/
│   │   │       └── analytics.types.ts
│   │   │
│   │   └── admin/           # Administración
│   │       ├── components/
│   │       │   ├── UserManagement.tsx
│   │       │   ├── WasherManagement.tsx
│   │       │   ├── AuditLog.tsx
│   │       │   └── NotificationCenter.tsx
│   │       ├── hooks/
│   │       │   └── useAdmin.ts
│   │       ├── services/
│   │       │   └── adminService.ts
│   │       └── types/
│   │           └── admin.types.ts
│   │
│   ├── hooks/               # 🎣 Custom Hooks Globales
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── useToast.ts
│   │
│   ├── layouts/             # 📐 Layouts de páginas
│   │   ├── AuthLayout/      # Layout para login/registro
│   │   │   ├── AuthLayout.tsx
│   │   │   └── index.ts
│   │   ├── OperationalLayout/  # Layout para admin operativo
│   │   │   ├── OperationalLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── WasherLayout/    # Layout para lavadores
│   │   │   ├── WasherLayout.tsx
│   │   │   └── index.ts
│   │   └── AdminLayout/     # Layout para admin global
│   │       ├── AdminLayout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       ├── NotificationBell.tsx
│   │       └── index.ts
│   │
│   ├── pages/               # 📄 Páginas (Routes)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── PasswordRecoveryPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   ├── operational/     # Páginas para admin operativo
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ParkingPage.tsx
│   │   │   ├── WashingPage.tsx
│   │   │   ├── ExpensesPage.tsx
│   │   │   └── ShiftReportPage.tsx
│   │   ├── washer/          # Páginas para lavadores
│   │   │   ├── MyServicesPage.tsx
│   │   │   └── MyBonusesPage.tsx
│   │   └── admin/           # Páginas para admin global
│   │       ├── DashboardPage.tsx
│   │       ├── RatesPage.tsx
│   │       ├── SubscriptionsPage.tsx
│   │       ├── AgreementsPage.tsx
│   │       ├── ReportsPage.tsx
│   │       ├── UsersPage.tsx
│   │       └── AuditLogPage.tsx
│   │
│   ├── services/            # 🌐 API Services (HTTP clients)
│   │   ├── api.ts           # Axios instance configurado
│   │   └── index.ts
│   │
│   ├── store/               # 🗂️ State Management (Redux Toolkit / Zustand)
│   │   ├── slices/          # Redux slices o Zustand stores
│   │   │   ├── authSlice.ts
│   │   │   ├── parkingSlice.ts
│   │   │   ├── washingSlice.ts
│   │   │   └── uiSlice.ts
│   │   ├── middleware/      # Custom middleware
│   │   ├── store.ts         # Store configuration
│   │   └── hooks.ts         # Typed hooks (useAppDispatch, useAppSelector)
│   │
│   ├── types/               # 📝 TypeScript Types Globales
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── enums.ts
│   │
│   ├── utils/               # 🛠️ Utilidades
│   │   ├── formatters.ts    # Formateo de fechas, moneda, etc.
│   │   ├── validators.ts    # Validaciones
│   │   ├── constants.ts     # Constantes globales
│   │   └── helpers.ts       # Funciones helper
│   │
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point (Vite)
│   ├── router.tsx           # React Router configuration
│   └── index.css            # Estilos globales (Tailwind)
│
├── .env.example             # Variables de entorno de ejemplo
├── .eslintrc.cjs            # ESLint config
├── .prettierrc              # Prettier config
├── index.html               # HTML entry point
├── package.json
├── postcss.config.js        # PostCSS (Tailwind)
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite configuration
└── README.md
```

---

## 🎨 Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (o Zustand como alternativa)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios + React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 🚀 Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## 🧭 Flujos de Usuario

### 1. **Administrador Global**
- Login → Dashboard Admin
- Ver métricas generales (ingresos, gastos, ocupación)
- Gestionar tarifas y configuraciones
- Aprobar servicios de convenios
- Ver reportes y analítica avanzada
- Gestionar usuarios y lavadores
- Ver log de auditoría

### 2. **Administrador Operativo**
- Login → Dashboard Operativo
- Registrar entrada/salida de vehículos
- Crear y asignar servicios de lavado
- Registrar gastos del turno
- Cerrar turno (generar reporte)

### 3. **Lavador**
- Login → Mis Servicios
- Ver servicios asignados
- Ver estado de bonos
- Ver historial de lavados

---

## 👥 Asignación de Módulos (4 Desarrolladores)

- **Dev A**: Auth + Admin Layout + User Management
- **Dev B**: Parking + Washing + Dashboard Operativo
- **Dev C**: Rates + Subscriptions + Agreements
- **Dev D**: Reports + Analytics + Dashboard Global

---

**¡Listo para empezar a construir la UI! 🎨**
