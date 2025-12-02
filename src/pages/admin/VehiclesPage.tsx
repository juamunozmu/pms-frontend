import React, { useState, useEffect } from 'react';
import { Car, Search, Clock, Loader, Plus, X, Droplets, Wallet } from 'lucide-react';
import { vehicleService, ActiveVehicle, EntryRequest } from '@/services/vehicleService';
import { washingService } from '@/services/washingService';
import { shiftService } from '@/services/shiftService';
import { useAuth } from '@/contexts/AuthContext';

const VehiclesPage: React.FC = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<ActiveVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Shift Modal State
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [initialCash, setInitialCash] = useState('');
    const [shiftLoading, setShiftLoading] = useState(false);

    // Form States
    const [formData, setFormData] = useState<EntryRequest>({
        plate: '',
        vehicle_type: 'Carro',
        owner_name: '',
        owner_phone: '',
        helmet_count: 0,
        notes: ''
    });

    // Washing Service State
    const [includeWash, setIncludeWash] = useState(false);
    const [washData, setWashData] = useState({
        service_type: 'General',
        price: '',
        notes: ''
    });

    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const data = await vehicleService.getParkingRecords(filterStatus, 100);
            setVehicles(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError('Error al cargar los vehículos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [filterStatus]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'helmet_count' ? Number(value) : value
        }));
    };

    const handleWashInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWashData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStartShift = async (e: React.FormEvent) => {
        e.preventDefault();
        setShiftLoading(true);
        try {
            await shiftService.startShift({ initial_cash: Number(initialCash) });
            setIsShiftModalOpen(false);
            alert('Turno iniciado correctamente. Ahora puede registrar vehículos.');
        } catch (err: any) {
            console.error('Error starting shift:', err);
            alert(err.response?.data?.detail || 'Error al iniciar turno');
        } finally {
            setShiftLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            // 1. Register Parking Entry
            await vehicleService.registerEntry(formData);

            // 2. Register Washing Service (if selected)
            if (includeWash) {
                await washingService.createService({
                    plate: formData.plate,
                    vehicle_type: formData.vehicle_type,
                    owner_name: formData.owner_name,
                    owner_phone: formData.owner_phone,
                    service_type: washData.service_type,
                    price: Number(washData.price),
                    notes: washData.notes || formData.notes // Use wash notes or fallback to entry notes
                });
            }

            await fetchVehicles();
            setIsModalOpen(false);

            // Reset Form
            setFormData({
                plate: '',
                vehicle_type: 'Carro',
                owner_name: '',
                owner_phone: '',
                helmet_count: 0,
                notes: ''
            });
            setIncludeWash(false);
            setWashData({
                service_type: 'General',
                price: '',
                notes: ''
            });

        } catch (err: any) {
            console.error('Error registering entry:', err);
            const errorMessage = err.response?.data?.detail || '';

            if (errorMessage.includes('No active shift') || errorMessage.includes('start a shift')) {
                if (confirm('No hay un turno activo. ¿Desea iniciar un turno ahora?')) {
                    setIsShiftModalOpen(true);
                }
            } else {
                alert(errorMessage || 'Error al registrar el ingreso');
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    // Filter vehicles based on search term
    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = v.plate.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'parqueado': return 'bg-blue-100 text-blue-800';
            case 'en_lavado': return 'bg-yellow-100 text-yellow-800';
            case 'salido': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'parqueado': return 'Parqueado';
            case 'en_lavado': return 'En Lavado';
            case 'salido': return 'Salido';
            default: return status;
        }
    };

    const stats = {
        total: vehicles.length,
        parqueado: vehicles.filter(v => !v.exit_time).length,
        salidos: vehicles.filter(v => v.exit_time).length
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Registro de Vehículos</h1>
                    <p className="text-gray-600">Historial de vehículos en el parqueadero</p>
                </div>
                {user?.role !== 'global_admin' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsShiftModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                        >
                            <Wallet className="w-5 h-5" />
                            Iniciar Turno
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            Registrar Ingreso
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Car className="w-8 h-8 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-600">Total Activos</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Car className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-600">Parqueados</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.parqueado}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por placa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Activos
                        </button>
                        <button
                            onClick={() => setFilterStatus('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'completed' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Completados
                        </button>
                    </div>
                </div>
            </div>

            {/* Vehicles Table */}
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
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Hora Ingreso</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tiempo</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">Notas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-gray-900 text-lg">{vehicle.plate}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Car className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">{vehicle.vehicle_type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.exit_time ? 'salido' : 'parqueado')}`}>
                                                {getStatusText(vehicle.exit_time ? 'salido' : 'parqueado')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700">{new Date(vehicle.entry_time).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-700">{vehicle.duration_so_far}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="text-gray-500 text-sm">{vehicle.notes || '-'}</span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredVehicles.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No se encontraron vehículos activos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Registrar Ingreso</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Vehicle Info Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                                    <input
                                        type="text"
                                        name="plate"
                                        value={formData.plate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent uppercase"
                                        placeholder="AAA123"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                                        <select
                                            name="vehicle_type"
                                            value={formData.vehicle_type}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        >
                                            <option value="Carro">Carro</option>
                                            <option value="Moto">Moto</option>
                                            <option value="Camioneta">Camioneta</option>
                                        </select>
                                    </div>
                                    {formData.vehicle_type === 'Moto' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cascos</label>
                                            <input
                                                type="number"
                                                name="helmet_count"
                                                value={formData.helmet_count}
                                                onChange={handleInputChange}
                                                min="0"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Propietario *</label>
                                    <input
                                        type="text"
                                        name="owner_name"
                                        value={formData.owner_name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        placeholder="Nombre completo"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="owner_phone"
                                        value={formData.owner_phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        placeholder="3001234567"
                                    />
                                </div>
                            </div>

                            {/* Washing Service Toggle */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <input
                                        type="checkbox"
                                        id="includeWash"
                                        checked={includeWash}
                                        onChange={(e) => setIncludeWash(e.target.checked)}
                                        className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                                    />
                                    <label htmlFor="includeWash" className="text-gray-900 font-medium flex items-center gap-2 cursor-pointer">
                                        <Droplets className="w-5 h-5 text-blue-500" />
                                        Agregar Servicio de Lavado
                                    </label>
                                </div>

                                {includeWash && (
                                    <div className="bg-blue-50 p-4 rounded-lg space-y-4 animate-fadeIn">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lavado *</label>
                                            <select
                                                name="service_type"
                                                value={washData.service_type}
                                                onChange={handleWashInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            >
                                                <option value="General">General</option>
                                                <option value="Motor">Motor</option>
                                                <option value="Chasis">Chasis</option>
                                                <option value="Cojinería">Cojinería</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={washData.price}
                                                    onChange={handleWashInputChange}
                                                    required={includeWash}
                                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Lavado</label>
                                            <textarea
                                                name="notes"
                                                value={washData.notes}
                                                onChange={handleWashInputChange}
                                                rows={2}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                placeholder="Detalles del lavado..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* General Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Generales</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    placeholder="Detalles del ingreso..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {submitLoading ? 'Procesando...' : (includeWash ? 'Registrar Ingreso y Lavado' : 'Registrar Ingreso')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Shift Modal */}
            {isShiftModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Iniciar Turno</h2>
                            <button onClick={() => setIsShiftModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleStartShift} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Inicial (Efectivo) *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={initialCash}
                                        onChange={(e) => setInitialCash(e.target.value)}
                                        required
                                        min="0"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Ingrese la cantidad de dinero en caja al iniciar el turno.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={shiftLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {shiftLoading ? 'Iniciando...' : 'Iniciar Turno'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehiclesPage;
