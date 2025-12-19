import { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { officeStorage, settingsStorage } from '../../utils/storage';
import { Building2, Plus, Edit2, Trash2, MapPin, Clock, Settings2 } from 'lucide-react';

export default function SettingsPage() {
    const [offices, setOffices] = useState([]);
    const [settings, setSettings] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [editingOffice, setEditingOffice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        lat: '',
        lon: '',
        radius: 100,
        workStart: '08:00',
        workEnd: '17:00'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setOffices(officeStorage.getAll());
        setSettings(settingsStorage.get());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const officeData = {
                ...formData,
                lat: parseFloat(formData.lat),
                lon: parseFloat(formData.lon),
                radius: parseInt(formData.radius)
            };

            if (editingOffice) {
                officeStorage.update(editingOffice.id, officeData);
            } else {
                officeStorage.create(officeData);
            }
            loadData();
            setShowModal(false);
            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (office) => {
        setEditingOffice(office);
        setFormData({
            name: office.name,
            address: office.address || '',
            lat: office.lat.toString(),
            lon: office.lon.toString(),
            radius: office.radius,
            workStart: office.workStart,
            workEnd: office.workEnd
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kantor ini?')) {
            officeStorage.delete(id);
            loadData();
        }
    };

    const resetForm = () => {
        setEditingOffice(null);
        setFormData({
            name: '',
            address: '',
            lat: '',
            lon: '',
            radius: 100,
            workStart: '08:00',
            workEnd: '17:00'
        });
    };

    const handleSettingChange = (key, value) => {
        const updated = settingsStorage.update({ [key]: value });
        setSettings(updated);
    };

    return (
        <PageWrapper
            title="Pengaturan"
            subtitle="Kelola kantor dan konfigurasi sistem"
        >
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Offices */}
                <div className="lg:col-span-2">
                    <Card padding="p-0">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <CardTitle>Daftar Kantor</CardTitle>
                            <Button variant="primary" size="sm" onClick={() => { resetForm(); setShowModal(true); }}>
                                <Plus className="w-4 h-4" />
                                Tambah
                            </Button>
                        </div>
                        <CardContent className="p-5">
                            <div className="space-y-4">
                                {offices.map((office) => (
                                    <div key={office.id} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-primary-100 rounded-xl">
                                                    <Building2 className="w-6 h-6 text-primary-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{office.name}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{office.address}</p>
                                                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>Radius: {office.radius}m</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{office.workStart} - {office.workEnd}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(office)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(office.id)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-danger-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings */}
                <div>
                    <Card>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Settings2 className="w-5 h-5 text-gray-600" />
                            </div>
                            <CardTitle>Pengaturan Sistem</CardTitle>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">Mock Location</p>
                                    <p className="text-xs text-gray-500">Izinkan lokasi simulasi untuk testing</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.allowMockLocation || false}
                                    onChange={(e) => handleSettingChange('allowMockLocation', e.target.checked)}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">Reminder</p>
                                    <p className="text-xs text-gray-500">Aktifkan pengingat absen</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.reminderEnabled || false}
                                    onChange={(e) => handleSettingChange('reminderEnabled', e.target.checked)}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                            </label>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add/Edit Office Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingOffice ? 'Edit Kantor' : 'Tambah Kantor'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nama Kantor"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: SDN 01 Menteng"
                        required
                    />
                    <Input
                        label="Alamat"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Alamat lengkap"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.lat}
                            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                            placeholder="-6.200000"
                            required
                        />
                        <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.lon}
                            onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                            placeholder="106.816666"
                            required
                        />
                    </div>
                    <Input
                        label="Radius (meter)"
                        type="number"
                        value={formData.radius}
                        onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                        placeholder="100"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Jam Masuk"
                            type="time"
                            value={formData.workStart}
                            onChange={(e) => setFormData({ ...formData, workStart: e.target.value })}
                            required
                        />
                        <Input
                            label="Jam Pulang"
                            type="time"
                            value={formData.workEnd}
                            onChange={(e) => setFormData({ ...formData, workEnd: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1" loading={loading}>
                            {editingOffice ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageWrapper>
    );
}
