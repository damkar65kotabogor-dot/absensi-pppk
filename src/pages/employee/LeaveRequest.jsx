import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { leaveStorage } from '../../utils/storage';
import { formatDateShort } from '../../utils/dateHelper';
import { FileText, Plus, Calendar, CheckCircle, Clock, X } from 'lucide-react';

const leaveTypes = [
    { value: 'sakit', label: 'Sakit' },
    { value: 'cuti_tahunan', label: 'Cuti Tahunan' },
    { value: 'dinas_luar', label: 'Dinas Luar' },
    { value: 'lainnya', label: 'Lainnya' }
];

export default function LeaveRequestPage() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        type: 'cuti_tahunan',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            const userLeaves = leaveStorage.getByUserId(user.id);
            const sorted = userLeaves.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLeaves(sorted);
        }
    }, [user]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.startDate) {
            newErrors.startDate = 'Tanggal mulai harus diisi';
        }
        if (!formData.endDate) {
            newErrors.endDate = 'Tanggal selesai harus diisi';
        }
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = 'Tanggal selesai harus setelah tanggal mulai';
        }
        if (!formData.reason.trim()) {
            newErrors.reason = 'Alasan harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const newLeave = leaveStorage.create({
                userId: user.id,
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
                attachmentUrl: null
            });

            setLeaves([newLeave, ...leaves]);
            setShowForm(false);
            setSuccess(true);
            setFormData({ type: 'cuti_tahunan', startDate: '', endDate: '', reason: '' });

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to submit leave request:', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = leaveStorage.getStats(user?.id);

    return (
        <PageWrapper
            title="Pengajuan Izin & Cuti"
            subtitle="Kelola pengajuan izin, sakit, dan cuti Anda"
        >
            {/* Success message */}
            {success && (
                <Card className="mb-6 bg-success-50 border border-success-200">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success-500" />
                        <p className="text-success-700 font-medium">
                            Pengajuan berhasil dikirim! Mohon tunggu persetujuan dari admin.
                        </p>
                    </div>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="text-center p-4">
                    <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                    <p className="text-xs text-gray-500">Menunggu</p>
                </Card>
                <Card className="text-center p-4">
                    <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
                    <p className="text-xs text-gray-500">Disetujui</p>
                </Card>
                <Card className="text-center p-4">
                    <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <X className="w-5 h-5 text-danger-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                    <p className="text-xs text-gray-500">Ditolak</p>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Leave list */}
                <div className="lg:col-span-2">
                    <Card padding="p-0">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <CardTitle>Riwayat Pengajuan</CardTitle>
                            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
                                <Plus className="w-4 h-4" />
                                Ajukan Baru
                            </Button>
                        </div>
                        <CardContent className="p-5">
                            {leaves.length > 0 ? (
                                <div className="space-y-4">
                                    {leaves.map((leave) => (
                                        <div key={leave.id} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <span className="text-sm font-medium text-primary-600 capitalize">
                                                        {leave.type.replace('_', ' ')}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Diajukan: {formatDateShort(leave.createdAt)}
                                                    </p>
                                                </div>
                                                <StatusBadge status={leave.status} />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {formatDateShort(leave.startDate)} - {formatDateShort(leave.endDate)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{leave.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Belum ada pengajuan</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Form */}
                <div>
                    {showForm ? (
                        <Card>
                            <CardTitle className="mb-4">Form Pengajuan</CardTitle>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Select
                                    label="Jenis Pengajuan"
                                    options={leaveTypes}
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                />

                                <Input
                                    label="Tanggal Mulai"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    error={errors.startDate}
                                />

                                <Input
                                    label="Tanggal Selesai"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    error={errors.endDate}
                                />

                                <Textarea
                                    label="Alasan"
                                    placeholder="Jelaskan alasan pengajuan..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    error={errors.reason}
                                />

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="flex-1"
                                        loading={loading}
                                    >
                                        Kirim
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <Card className="text-center">
                            <div className="py-8">
                                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Ajukan Izin Baru</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Klik tombol di bawah untuk membuat pengajuan izin atau cuti baru.
                                </p>
                                <Button variant="primary" onClick={() => setShowForm(true)}>
                                    <Plus className="w-4 h-4" />
                                    Buat Pengajuan
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
