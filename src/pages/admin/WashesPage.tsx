import React, { useState, useEffect } from 'react';
import { Droplets, User, Clock, Car, DollarSign, Search, Loader, Play, CheckCircle, X } from 'lucide-react';
import { washingService, WashingService } from '@/services/washingService';
import { employeeService, Employee } from '@/services/employeeService';

// Extended interface for UI mapping
interface UIWash extends WashingService {
    uiStatus: 'espera' | 'proceso' | 'terminado';
}

const WashesPage: React.FC = () => {
    const [washes, setWashes] = useState<UIWash[]>([]);
    const [washers, setWashers] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state for assigning washer
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedWashId, setSelectedWashId] = useState<number | null>(null);
    const [selectedWasherId, setSelectedWasherId] = useState<number | ''>('');
    const [assignLoading, setAssignLoading] = useState(false);

    const mapStatus = (status: string): 'espera' | 'proceso' | 'terminado' => {
        switch (status) {
            case 'pending': return 'espera';
            case 'in_progress': return 'proceso';
            case 'completed': return 'terminado';
            default: return 'espera';
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [washesData, employeesData] = await Promise.all([
                washingService.getActiveServices(),
                employeeService.getAllEmployees()
            ]);

            const mappedWashes = washesData.map(wash => ({
                ...wash,
                uiStatus: mapStatus(wash.status)
            }));
            setWashes(mappedWashes);

            // Filter only active washers
            const activeWashers = employeesData.filter(emp => emp.role === 'washer' && emp.is_active);
            setWashers(activeWashers);

            setError(null);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStartWash = (washId: number) => {
        setSelectedWashId(washId);
        setSelectedWasherId('');
        setIsAssignModalOpen(true);
    };

    const handleAssignWasher = async () => {
        if (!selectedWashId || !selectedWasherId) return;

        setAssignLoading(true);
        try {
            await washingService.assignWasher(selectedWashId, Number(selectedWasherId));
            await fetchData(); // Reload data
            setIsAssignModalOpen(false);
            setSelectedWashId(null);
            setSelectedWasherId('');
        } catch (err) {
            console.error('Error assigning washer:', err);
            alert('Error al asignar el lavador');
        } finally {
            setAssignLoading(false);
        }
    };

    const handleCompleteWash = async (washId: number) => {
        if (!window.confirm('¿Estás seguro de finalizar este lavado?')) return;

        try {
            await washingService.completeService(washId);
            await fetchData(); // Reload data
        } catch (err) {
            console.error('Error completing wash:', err);
            alert('Error al finalizar el lavado');
        }
    };

    const filteredWashes = washes.filter(w => {
        const matchesSearch = w.vehicle_plate.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const stats = {
        total: washes.length,
        espera: washes.filter(w => w.uiStatus === 'espera').length,
        proceso: washes.filter(w => w.uiStatus === 'proceso').length,
        terminado: washes.filter(w => w.uiStatus === 'terminado').length,
        totalRevenue: washes.filter(w => w.uiStatus === 'terminado').reduce((sum, w) => sum + w.price, 0)
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Servicios de Lavado</h1>
                <p className="text-gray-600">Monitoreo y gestión de servicios de lavado</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Droplets className="w-8 h-8 text-blue-600" />
                        <h3 className="text-sm font-medium text-gray-600">Total Lavados</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-8 h-8 text-yellow-600" />
                        <h3 className="text-sm font-medium text-gray-600">En Espera</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">{stats.espera}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Droplets className="w-8 h-8 text-blue-600" />
                        <h3 className="text-sm font-medium text-gray-600">En Proceso</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.proceso}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Droplets className="w-8 h-8 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Terminados</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.terminado}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-8 h-8 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Ingresos Hoy</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Search Only */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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
            </div>

            {/* Kanban View */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-12">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column: En Espera */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <h2 className="text-xl font-bold text-gray-900">En Espera</h2>
                            <span className="ml-auto bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {filteredWashes.filter(w => w.uiStatus === 'espera').length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {filteredWashes.filter(w => w.uiStatus === 'espera').map(wash => (
                                <div key={wash.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="font-bold text-lg text-gray-900">{wash.vehicle_plate}</span>
                                        <span className="text-sm font-medium text-yellow-700">${wash.price.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Car className="w-4 h-4" />
                                            <span>{wash.vehicle_type || 'Vehículo'} - {wash.service_type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>{wash.washer_name || 'Sin asignar'}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleStartWash(wash.id)}
                                        className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Play className="w-4 h-4" />
                                        Iniciar Lavado
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column: En Proceso */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Droplets className="w-5 h-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">En Proceso</h2>
                            <span className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {filteredWashes.filter(w => w.uiStatus === 'proceso').length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {filteredWashes.filter(w => w.uiStatus === 'proceso').map(wash => (
                                <div key={wash.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="font-bold text-lg text-gray-900">{wash.vehicle_plate}</span>
                                        <span className="text-sm font-medium text-blue-700">${wash.price.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-2">
                                            <Car className="w-4 h-4" />
                                            <span>{wash.vehicle_type || 'Vehículo'} - {wash.service_type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>{wash.washer_name || 'Sin asignar'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Inicio: {wash.start_time ? new Date(wash.start_time).toLocaleTimeString() : '-'}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCompleteWash(wash.id)}
                                        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Finalizar Lavado
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column: Terminado */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Droplets className="w-5 h-5 text-green-600" />
                            <h2 className="text-xl font-bold text-gray-900">Terminados</h2>
                            <span className="ml-auto bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {filteredWashes.filter(w => w.uiStatus === 'terminado').length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {filteredWashes.filter(w => w.uiStatus === 'terminado').map(wash => (
                                <div key={wash.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="font-bold text-lg text-gray-900">{wash.vehicle_plate}</span>
                                        <span className="text-sm font-medium text-green-700">${wash.price.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Car className="w-4 h-4" />
                                            <span>{wash.vehicle_type || 'Vehículo'} - {wash.service_type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>{wash.washer_name || 'Sin asignar'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>{wash.start_time ? new Date(wash.start_time).toLocaleTimeString() : '-'} - {wash.end_time ? new Date(wash.end_time).toLocaleTimeString() : '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Washer Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Asignar Lavador</h2>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Lavador</label>
                                <select
                                    value={selectedWasherId}
                                    onChange={(e) => setSelectedWasherId(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="">Seleccione un lavador...</option>
                                    {washers.map(washer => (
                                        <option key={washer.id} value={washer.id}>
                                            {washer.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleAssignWasher}
                                disabled={!selectedWasherId || assignLoading}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {assignLoading ? 'Asignando...' : 'Confirmar e Iniciar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WashesPage;
