import React, { useState, useEffect } from 'react';
import { DollarSign, Save, Edit2, Car, Plus, Trash2, X, Loader } from 'lucide-react';
import { rateService, Rate, CreateRateRequest } from '@/services/rateService';

const AdminPricingConfig: React.FC = () => {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRate, setEditingRate] = useState<Rate | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [formData, setFormData] = useState<CreateRateRequest>({
        vehicle_type: 'CARRO',
        rate_type: 'MINUTO',
        price: 0,
        description: '',
        is_active: true
    });

    const fetchRates = async () => {
        setLoading(true);
        try {
            const data = await rateService.getRates();
            setRates(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching rates:', err);
            setError('Error al cargar las tarifas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const handleEditClick = (rate: Rate) => {
        setEditingRate(rate);
        setFormData({
            vehicle_type: rate.vehicle_type,
            rate_type: rate.rate_type,
            price: rate.price,
            description: rate.description || '',
            is_active: rate.is_active
        });
        setIsCreating(false);
    };

    const handleCreateClick = () => {
        setEditingRate(null);
        setFormData({
            vehicle_type: 'CARRO',
            rate_type: 'MINUTO',
            price: 0,
            description: '',
            is_active: true
        });
        setIsCreating(true);
    };

    const handleCancel = () => {
        setEditingRate(null);
        setIsCreating(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isCreating) {
                await rateService.createRate(formData);
                alert('Tarifa creada exitosamente');
            } else if (editingRate) {
                await rateService.updateRate(editingRate.id, formData);
                alert('Tarifa actualizada exitosamente');
            }
            handleCancel();
            fetchRates();
        } catch (err) {
            console.error('Error saving rate:', err);
            alert('Error al guardar la tarifa.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta tarifa?')) {
            try {
                await rateService.deleteRate(id);
                alert('Tarifa eliminada exitosamente');
                fetchRates();
            } catch (err) {
                console.error('Error deleting rate:', err);
                alert('Error al eliminar la tarifa.');
            }
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Configuración de Tarifas
                </h1>
                <p className="text-gray-600">
                    Administra los precios de parqueadero
                </p>
            </div>

            {/* Parking Rates List */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Tarifas de Parqueadero</h2>
                    </div>
                    <button
                        onClick={handleCreateClick}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Tarifa
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center py-8">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Vehículo</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo Cobro</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Precio</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descripción</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rates.map((rate) => (
                                    <tr key={rate.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 font-medium">{rate.vehicle_type}</td>
                                        <td className="py-4 px-4">{rate.rate_type}</td>
                                        <td className="py-4 px-4 text-right font-bold text-green-600">
                                            ${rate.price.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{rate.description || '-'}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rate.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {rate.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(rate)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(rate.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {rates.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No hay tarifas configuradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            {(isCreating || editingRate) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isCreating ? 'Nueva Tarifa' : 'Editar Tarifa'}
                            </h3>
                            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Vehículo
                                </label>
                                <select
                                    value={formData.vehicle_type}
                                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="CARRO">Carro</option>
                                    <option value="MOTO">Moto</option>
                                    <option value="CAMIONETA">Camioneta</option>
                                    <option value="CAMION">Camión</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Cobro
                                </label>
                                <select
                                    value={formData.rate_type}
                                    onChange={(e) => setFormData({ ...formData, rate_type: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                                >
                                    <option value="MINUTO">Por Minuto</option>
                                    <option value="HORA">Por Hora</option>
                                    <option value="DIA">Por Día</option>
                                    <option value="MES">Mensualidad</option>
                                    <option value="CASCO">Casco (Moto)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
                                    placeholder="Ej: Tarifa estándar diurna"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                    Tarifa Activa
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                                >
                                    {isCreating ? 'Crear' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <div className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">Nota sobre tarifas:</p>
                        <p className="text-sm text-blue-800">
                            Las tarifas configuradas se aplicarán inmediatamente a todos los nuevos registros de entrada.
                            Asegúrate de tener al menos una tarifa activa por tipo de vehículo y cobro.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPricingConfig;