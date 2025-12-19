import { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { userStorage, officeStorage } from '../../utils/storage';
import { formatDateShort } from '../../utils/dateHelper';
import { Users, Plus, Edit2, Trash2, Search, Building2 } from 'lucide-react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [offices, setOffices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nip: '',
        fullName: '',
        password: 'password123',
        position: '',
        officeId: '',
        role: 'employee'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allUsers = userStorage.getAll();
        const allOffices = officeStorage.getAll();
        setEmployees(allUsers);
        setOffices(allOffices);
    };

    const filteredEmployees = employees.filter(e =>
        e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.nip.includes(searchQuery)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingEmployee) {
                userStorage.update(editingEmployee.id, formData);
            } else {
                userStorage.create(formData);
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

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            nip: employee.nip,
            fullName: employee.fullName,
            password: '',
            position: employee.position || '',
            officeId: employee.officeId || '',
            role: employee.role
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus pegawai ini?')) {
            userStorage.delete(id);
            loadData();
        }
    };

    const resetForm = () => {
        setEditingEmployee(null);
        setFormData({
            nip: '',
            fullName: '',
            password: 'password123',
            position: '',
            officeId: '',
            role: 'employee'
        });
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const getOfficeName = (officeId) => {
        const office = offices.find(o => o.id === officeId);
        return office?.name || '-';
    };

    return (
        <PageWrapper
            title="Manajemen Pegawai"
            subtitle="Kelola data pegawai dan penugasan"
        >
            <Card padding="p-0">
                <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <CardTitle>Daftar Pegawai ({filteredEmployees.length})</CardTitle>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari NIP atau nama..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-10 py-2"
                            />
                        </div>
                        <Button variant="primary" onClick={openAddModal}>
                            <Plus className="w-4 h-4" />
                            Tambah
                        </Button>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>NIP</th>
                                    <th>Nama Lengkap</th>
                                    <th>Jabatan</th>
                                    <th>Kantor</th>
                                    <th>Role</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td>
                                            <span className="font-mono text-sm">{employee.nip}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                                                    {employee.fullName.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-800">{employee.fullName}</span>
                                            </div>
                                        </td>
                                        <td>{employee.position || '-'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <span>{getOfficeName(employee.officeId)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${employee.role === 'admin' ? 'badge-primary' : 'badge-gray'}`}>
                                                {employee.role === 'admin' ? 'Admin' : 'Pegawai'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(employee)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-600"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-danger-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingEmployee ? 'Edit Pegawai' : 'Tambah Pegawai'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="NIP"
                        value={formData.nip}
                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                        placeholder="Masukkan NIP"
                        required
                    />
                    <Input
                        label="Nama Lengkap"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        required
                    />
                    {!editingEmployee && (
                        <Input
                            label="Password Awal"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Password awal"
                            required
                        />
                    )}
                    <Input
                        label="Jabatan"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Contoh: Guru Kelas"
                    />
                    <Select
                        label="Kantor"
                        value={formData.officeId}
                        onChange={(e) => setFormData({ ...formData, officeId: parseInt(e.target.value) })}
                        options={[
                            { value: '', label: 'Pilih kantor...' },
                            ...offices.map(o => ({ value: o.id, label: o.name }))
                        ]}
                    />
                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        options={[
                            { value: 'employee', label: 'Pegawai' },
                            { value: 'admin', label: 'Administrator' }
                        ]}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1" loading={loading}>
                            {editingEmployee ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </PageWrapper>
    );
}
