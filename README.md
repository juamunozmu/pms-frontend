# PMS Frontend - Parking & Car Wash Management System

Interfaz web para el sistema de gestión de parqueadero y lavado de vehículos.

## 🎨 Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Redux Toolkit (o Zustand)
- **Router**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios + React Query
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Estructura del Proyecto

Ver [STRUCTURE.md](./STRUCTURE.md) para detalles completos de la arquitectura de carpetas.

```
src/
├── features/           # Módulos por funcionalidad (Feature-Based)
├── components/         # Componentes reutilizables
├── layouts/            # Layouts por rol (Admin, Operativo, Lavador)
├── pages/              # Páginas (routes)
├── hooks/              # Custom hooks globales
├── services/           # API clients
├── store/              # State management
├── types/              # TypeScript types
└── utils/              # Utilidades
```

## 🚀 Inicio Rápido

### 1. Clonar repositorio
```bash
git clone https://github.com/pms-project-rc/pms-frontend.git
cd pms-frontend
```

### 2. Instalar dependencias
```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con la URL del backend
```

### 4. Ejecutar servidor de desarrollo
```bash
npm run dev
```

### 5. Acceder a la aplicación
- **URL**: http://localhost:5173

## 🏗️ Build para Producción

```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

## 📱 Roles de Usuario

### 1. Administrador Global
- Dashboard con métricas generales
- Gestión de tarifas y configuraciones
- Aprobación de servicios de convenios
- Reportes y analítica avanzada
- Gestión de usuarios y lavadores
- Log de auditoría

### 2. Administrador Operativo
- Dashboard operativo
- Registro de entradas/salidas
- Creación y asignación de lavados
- Registro de gastos
- Cierre de turno

### 3. Lavador
- Vista de servicios asignados
- Estado de bonos
- Historial de lavados

## 🎨 Tailwind Configuration

El proyecto usa Tailwind CSS con configuración personalizada para:
- Colores del brand
- Breakpoints responsivos
- Animaciones personalizadas
- Componentes reutilizables

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Tests con UI
npm run test:ui

# Coverage
npm run test:coverage
```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # ESLint
npm run format       # Prettier
npm run type-check   # TypeScript check
```

## 📚 Estructura de Features

Cada feature sigue el patrón:
```
feature-name/
├── components/      # Componentes específicos del feature
├── hooks/           # Custom hooks del feature
├── services/        # API calls del feature
├── types/           # Types del feature
└── index.ts         # Exports públicos
```

## 👥 Asignación de Módulos

- **Dev A**: Auth + Admin Layout + User Management
- **Dev B**: Parking + Washing + Dashboard Operativo
- **Dev C**: Rates + Subscriptions + Agreements
- **Dev D**: Reports + Analytics + Dashboard Global

## 🎨 Componentes Principales

### Common Components
- Button, Input, Card, Badge
- Spinner, Alert, Notification
- FormField, Select, DatePicker

### Business Components
- VehicleEntryForm, ServiceForm
- WasherAssignment, ShiftSummary
- MetricCard, Charts (Line, Bar, Pie)

## 🌐 Rutas Principales

```
/                       # Login
/reset-password         # Recuperar contraseña

# Administrador Global
/admin/dashboard        # Dashboard
/admin/rates            # Tarifas
/admin/subscriptions    # Mensualidades
/admin/agreements       # Convenios
/admin/reports          # Reportes
/admin/users            # Usuarios

# Administrador Operativo
/operational/dashboard  # Dashboard
/operational/parking    # Parqueadero
/operational/washing    # Lavados
/operational/expenses   # Gastos

# Lavador
/washer/services        # Mis servicios
/washer/bonuses         # Mis bonos
```

## 🔒 Autenticación

- JWT guardado en localStorage
- Refresh token rotation
- Protected routes con guards
- Auto-logout al expirar token

## 📊 State Management

Usando Redux Toolkit con slices:
- authSlice - Autenticación y usuario actual
- parkingSlice - Estado de parqueadero
- washingSlice - Servicios de lavado
- uiSlice - Estado de UI (modales, notificaciones)

## 🎯 Buenas Prácticas

- TypeScript strict mode
- Componentes funcionales con hooks
- Separation of concerns (lógica vs presentación)
- Custom hooks para lógica reutilizable
- Validación de formularios con Zod
- Error boundaries
- Lazy loading de routes

## 📄 Licencia

MIT

## 🤝 Contribuciones

Ver guía de contribución en el repositorio principal.
SPA in React + Tailwind for final users
