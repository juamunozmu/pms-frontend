import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Edit2, Trash2, Plus, AlertCircle, Loader } from 'lucide-react';
import { subscriptionService, Subscription, CreateSubscriptionRequest } from '@/services/subscriptionService';

// Extended interface for UI display including calculated fields
interface UISubscription extends Subscription {
    status: 'activa' | 'por_vencer' | 'vencida';
    daysRemaining: number;
}

const SubscriptionsPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<UISubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const [formData, setFormData] = useState<CreateSubscriptionRequest>({
        plate: '',
        vehicle_type: 'Carro',
        owner_name: '',
        owner_phone: '',
        monthly_fee: 0,
        start_date: new Date().toISOString().split('T')[0],
        duration_days: 30,
        notes: ''
    });

    const calculateStatusAndDays = (endDateStr: string) => {
        const end = new Date(endDateStr);
        const now = new Date();
        // Reset hours to compare dates only
        now.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - now.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status: 'activa' | 'por_vencer' | 'vencida' = 'activa';
        if (daysRemaining < 0) status = 'vencida';
        else if (daysRemaining <= 7) status = 'por_vencer';

        return { status, daysRemaining };
    };

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const data = await subscriptionService.getSubscriptions();
            const processedData = data.map(sub => {
                const { status, daysRemaining } = calculateStatusAndDays(sub.end_date);
                return { ...sub, status, daysRemaining };
            });
            setSubscriptions(processedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching subscriptions:', err);
            setError('Error al cargar las suscripciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await subscriptionService.createSubscription(formData);
            alert('Suscripción creada exitosamente');
            setShowModal(false);
            setFormData({
                plate: '',
                vehicle_type: 'Carro',
                owner_name: '',
                owner_phone: '',
                monthly_fee: 0,
                start_date: new Date().toISOString().split('T')[0],
                duration_days: 30,
                notes: ''
            });
            fetchSubscriptions();
        } catch (err) {
            console.error('Error creating subscription:', err);
            alert('Error al crear la suscripción.');
        }
    };

    const filteredSubs = filterStatus === 'all'
        ? subscriptions
        : subscriptions.filter(s => s.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'activa': return 'bg-green-100 text-green-800';
            case 'por_vencer': return 'bg-yellow-100 text-yellow-800';
            case 'vencida': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'activa': return 'Activa';
            case 'por_vencer': return 'Por Vencer';
            case 'vencida': return 'Vencida';
            default: return status;
        }
    };

    const stats = {
        total: subscriptions.length,
        activas: subscriptions.filter(s => s.status === 'activa').length,
        porVencer: subscriptions.filter(s => s.status === 'por_vencer').length,
        vencidas: subscriptions.filter(s => s.status === 'vencida').length,
        monthlyRevenue: subscriptions.filter(s => s.status === 'activa').reduce((sum, s) => sum + s.price, 0)
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Mensualidades</h1>
                    <p className="text-gray-600">Gestión de suscripciones mensuales de parqueadero</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Mensualidad
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-8 h-8 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-600">Total</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-8 h-8 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Activas</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.activas}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-8 h-8 text-yellow-600" />
                        <h3 className="text-sm font-medium text-gray-600">Por Vencer</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{stats.porVencer}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                        <h3 className="text-sm font-medium text-gray-600">Vencidas</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats.vencidas}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Ingreso Mensual</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => setFilterStatus('activa')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'activa' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Activas
                    </button>
                    <button
                        onClick={() => setFilterStatus('por_vencer')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'por_vencer' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Por Vencer
                    </button>
                    <button
                        onClick={() => setFilterStatus('vencida')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'vencida' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Vencidas
                    </button>
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center py-12">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Placa</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Propietario</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Teléfono</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Vigencia</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Valor Mensual</th>
                                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubs.map((sub) => (
                                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-gray-900 text-lg">{sub.vehicle_plate}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">{sub.vehicle?.owner_name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-700">{sub.vehicle?.owner_phone || 'N/A'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-700">{sub.vehicle?.vehicle_type || 'N/A'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <div className="text-gray-700">{new Date(sub.start_date).toLocaleDateString()} - {new Date(sub.end_date).toLocaleDateString()}</div>
                                                <div className={`font-medium ${sub.daysRemaining < 0 ? 'text-red-600' :
                                                    sub.daysRemaining <= 7 ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>
                                                    {sub.daysRemaining < 0
                                                        ? `Vencida hace ${Math.abs(sub.daysRemaining)} días`
                                                        : `${sub.daysRemaining} días restantes`}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                                                {getStatusText(sub.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-semibold text-gray-900">${sub.price.toLocaleString()}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Actions placeholder */}
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar (Próximamente)">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar (Próximamente)">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSubs.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-8 text-gray-500">
                                            No se encontraron suscripciones.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Alert for expiring subscriptions */}
            {stats.porVencer > 0 && (
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-900 mb-1">Mensualidades por vencer</p>
                            <p className="text-sm text-yellow-800">
                                Hay {stats.porVencer} mensualidad{stats.porVencer > 1 ? 'es' : ''} que vence{stats.porVencer > 1 ? 'n' : ''} próximamente. Contacta a los propietarios para renovar.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nueva Mensualidad</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Placa del Vehículo</label>
                                        <input
                                            type="text"
                                            value={formData.plate}
                                            onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                            required
                                            placeholder="AAA123"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                                        <select
                                            value={formData.vehicle_type}
                                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                            required
                                        >
                                            <option value="Carro">Carro</option>
                                            <option value="Moto">Moto</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Propietario</label>
                                        <input
                                            type="text"
                                            value={formData.owner_name}
                                            onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                            required
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input
                                            type="tel"
                                            value={formData.owner_phone}
                                            onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                            required
                                            placeholder="3001234567"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensualidad</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                value={formData.monthly_fee}
                                                onChange={(e) => setFormData({ ...formData, monthly_fee: Number(e.target.value) })}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duración (días)</label>
                                        <input
                                            type="number"
                                            value={formData.duration_days}
                                            onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                            required
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        rows={3}
                                        placeholder="Información adicional..."
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                                >
                                    Crear
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionsPage;
