import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Car,
    ShoppingCart,
    Calendar,
    Users,
    Activity,
    Loader
} from 'lucide-react';
import { dashboardService, DashboardMetrics } from '@/services/dashboardService';

type DateFilter = 'today' | 'week' | 'month' | 'custom';

interface KPICardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>('month');
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            let start = '';
            let end = '';
            const today = new Date();

            if (dateFilter === 'today') {
                start = today.toISOString().split('T')[0];
                end = start;
            } else if (dateFilter === 'week') {
                const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
                start = firstDay.toISOString().split('T')[0];
                end = new Date().toISOString().split('T')[0];
            } else if (dateFilter === 'month') {
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                start = firstDay.toISOString().split('T')[0];
                end = new Date().toISOString().split('T')[0];
            } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
                start = customDateRange.start;
                end = customDateRange.end;
            }

            const data = await dashboardService.getMetrics(start, end);
            setMetrics(data);
        } catch (err) {
            console.error('Error fetching dashboard metrics:', err);
            setError('Error al cargar los datos del dashboard. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateFilter !== 'custom' || (customDateRange.start && customDateRange.end)) {
            fetchMetrics();
        }
    }, [dateFilter, customDateRange]);

    if (loading && !metrics) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader className="w-10 h-10 animate-spin text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando métricas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Carga</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchMetrics}
                        className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Prepare data for display
    const kpiData = metrics ? [
        {
            title: 'Ingresos Totales',
            value: `$${metrics.total_revenue.toLocaleString()}`,
            change: metrics.revenue_growth || 0,
            icon: <DollarSign className="w-6 h-6 text-green-600" />,
            color: 'bg-green-50'
        },
        {
            title: 'Gastos Totales',
            value: `$${metrics.total_expenses.toLocaleString()}`,
            change: metrics.expenses_growth || 0,
            icon: <ShoppingCart className="w-6 h-6 text-red-600" />,
            color: 'bg-red-50'
        },
        {
            title: 'Servicios Realizados',
            value: metrics.total_services.toString(),
            change: 0, // Backend doesn't provide this yet
            icon: <Car className="w-6 h-6 text-blue-600" />,
            color: 'bg-blue-50'
        },
        {
            title: 'Convenios Activos',
            value: metrics.active_agreements.toString(),
            change: 0,
            icon: <Activity className="w-6 h-6 text-purple-600" />,
            color: 'bg-purple-50'
        }
    ] : [];

    // Calculate max value for charts scaling
    const maxChartValue = metrics?.revenue_by_day.reduce((max, day) => Math.max(max, day.revenue, day.expenses), 0) || 100;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Dashboard Administrativo
                </h1>
                <p className="text-gray-600">
                    Métricas y análisis del negocio en tiempo real
                </p>
            </div>

            {/* Date Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Período de Análisis</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setDateFilter('today')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${dateFilter === 'today'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Hoy
                    </button>
                    <button
                        onClick={() => setDateFilter('week')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${dateFilter === 'week'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Esta Semana
                    </button>
                    <button
                        onClick={() => setDateFilter('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${dateFilter === 'month'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Este Mes
                    </button>
                    <button
                        onClick={() => setDateFilter('custom')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${dateFilter === 'custom'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Rango Personalizado
                    </button>
                </div>

                {dateFilter === 'custom' && (
                    <div className="mt-4 flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha Inicio
                            </label>
                            <input
                                type="date"
                                value={customDateRange.start}
                                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha Fin
                            </label>
                            <input
                                type="date"
                                value={customDateRange.end}
                                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {kpiData.map((kpi, index) => (
                    <KPICard key={index} {...kpi} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Income vs Expenses Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Ingresos vs Gastos (Últimos días)
                    </h2>
                    <div className="space-y-4">
                        {metrics?.revenue_by_day.slice(-5).map((day, index) => {
                            const incomeWidth = maxChartValue > 0 ? (day.revenue / maxChartValue) * 100 : 0;
                            const expenseWidth = maxChartValue > 0 ? (day.expenses / maxChartValue) * 100 : 0;

                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-600 w-24">{day.date}</span>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div className="h-4 bg-gray-100 rounded overflow-hidden flex">
                                            <div className="bg-green-500 h-full rounded" style={{ width: `${Math.max(incomeWidth, 1)}%` }}></div>
                                        </div>
                                        <div className="h-4 bg-gray-100 rounded overflow-hidden flex">
                                            <div className="bg-red-400 h-full rounded" style={{ width: `${Math.max(expenseWidth, 1)}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {(!metrics?.revenue_by_day || metrics.revenue_by_day.length === 0) && (
                            <p className="text-center text-gray-500 py-8">No hay datos suficientes para mostrar el gráfico</p>
                        )}
                    </div>
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600">Ingresos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-400 rounded"></div>
                            <span className="text-sm text-gray-600">Gastos</span>
                        </div>
                    </div>
                </div>

                {/* Top Washers Ranking */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Users className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Top Lavadores</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ranking</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lavador</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Servicios</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Generado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics?.top_washers.map((washer, index) => (
                                    <tr key={washer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-orange-600' :
                                                        'bg-gray-300'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-medium text-gray-900">{washer.name}</span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                                {washer.services_count}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="font-semibold text-green-600">${washer.revenue_generated.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                                {(!metrics?.top_washers || metrics.top_washers.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-500">
                                            No hay datos de lavadores en este período
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;