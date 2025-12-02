import React, { useState, useEffect } from 'react';
import { Handshake, Building2, Percent, Edit2, Trash2, Plus, Users, Loader } from 'lucide-react';
import { agreementService, Agreement, CreateAgreementRequest } from '@/services/agreementService';

const AgreementsPage: React.FC = () => {
    const [agreements, setAgreements] = useState<Agreement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState<CreateAgreementRequest>({
        name: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        parking_discount: 0,
        washing_discount: 0
    });

    const fetchAgreements = async () => {
        setLoading(true);
        try {
            const data = await agreementService.getAgreements();
            setAgreements(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching agreements:', err);
            setError('Error al cargar los convenios.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgreements();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await agreementService.createAgreement(formData);
            alert('Convenio creado exitosamente');
            setShowModal(false);
            setFormData({
                name: '',
                contact_name: '',
                contact_phone: '',
                contact_email: '',
                parking_discount: 0,
                washing_discount: 0
            });
            fetchAgreements();
        } catch (err) {
            console.error('Error creating agreement:', err);
            alert('Error al crear el convenio.');
        }
    };

    const stats = {
        total: agreements.length,
        active: agreements.filter(a => a.is_active).length,
        totalVehicles: agreements.reduce((sum, a) => sum + (a.vehicles ? a.vehicles.length : 0), 0)
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Convenios Empresariales</h1>
                    <p className="text-gray-600">Gestión de acuerdos comerciales con empresas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Convenio
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Handshake className="w-8 h-8 text-blue-600" />
                        <h3 className="text-sm font-medium text-gray-600">Total Convenios</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Handshake className="w-8 h-8 text-green-600" />
                        <h3 className="text-sm font-medium text-gray-600">Convenios Activos</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-8 h-8 text-purple-600" />
                        <h3 className="text-sm font-medium text-gray-600">Vehículos Totales</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalVehicles}</p>
                </div>
            </div>

            {/* Agreements Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
            ) : error ? (
                <div className="text-red-600 text-center py-12">{error}</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {agreements.map((agreement) => (
                        <div key={agreement.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {/* Header */}
                            <div className={`p-6 ${agreement.is_active ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{agreement.name}</h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${agreement.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {agreement.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Actions placeholder - backend might not support update/delete yet */}
                                    <div className="flex gap-2">
                                        {/* 
                                        <button className="p-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        */}
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                {/* Contact Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Contacto:</span>
                                        <span className="text-sm font-medium text-gray-900">{agreement.contact_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">📞</span>
                                        <span className="text-sm text-gray-900">{agreement.contact_phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">📧</span>
                                        <span className="text-sm text-gray-900">{agreement.contact_email}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4"></div>

                                {/* Discounts */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Percent className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-medium text-blue-800">Descuento Parqueadero</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-600">{agreement.parking_discount}%</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Percent className="w-4 h-4 text-green-600" />
                                            <span className="text-xs font-medium text-green-800">Descuento Lavado</span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-600">{agreement.washing_discount}%</p>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        {/* Valid until not in current model, maybe add later */}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-600">Vehículos registrados:</span>
                                        <p className="text-sm font-semibold text-gray-900">{agreement.vehicles ? agreement.vehicles.length : 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && agreements.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <Handshake className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay convenios registrados</h3>
                    <p className="text-gray-600 mb-6">Comienza agregando un nuevo convenio empresarial</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                    >
                        Crear Primer Convenio
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuevo Convenio Empresarial</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Contacto</label>
                                    <input
                                        type="text"
                                        value={formData.contact_name}
                                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descuento Parqueadero (%)</label>
                                    <input
                                        type="number"
                                        value={formData.parking_discount}
                                        onChange={(e) => setFormData({ ...formData, parking_discount: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descuento Lavado (%)</label>
                                    <input
                                        type="number"
                                        value={formData.washing_discount}
                                        onChange={(e) => setFormData({ ...formData, washing_discount: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                                >
                                    Crear Convenio
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

export default AgreementsPage;
