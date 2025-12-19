import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { leaveStorage, userStorage } from '../../utils/storage';
import { formatDateShort } from '../../utils/dateHelper';
import { CheckCircle, X, FileText, Calendar, Clock, User } from 'lucide-react';

export default function LeaveApprovalPage() {
    const { user: currentUser } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState({});

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = () => {
        const allLeaves = leaveStorage.getAll();
        const allUsers = userStorage.getAll();

        const enriched = allLeaves.map(l => ({
            ...l,
            employee: allUsers.find(u => u.id === l.userId),
            approver: allUsers.find(u => u.id === l.approvedBy)
        }));

        setLeaves(enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    };

    const handleApprove = async (id) => {
        setLoading({ ...loading, [id]: 'approve' });
        try {
            leaveStorage.approve(id, currentUser.id);
            loadLeaves();
        } finally {
            setLoading({ ...loading, [id]: null });
        }
    };

    const handleReject = async (id) => {
        setLoading({ ...loading, [id]: 'reject' });
        try {
            leaveStorage.reject(id, currentUser.id);
            loadLeaves();
        } finally {
            setLoading({ ...loading, [id]: null });
        }
    };

    const filteredLeaves = filter === 'all'
        ? leaves
        : leaves.filter(l => l.status === filter);

    const stats = {
        pending: leaves.filter(l => l.status === 'pending').length,
        approved: leaves.filter(l => l.status === 'approved').length,
        rejected: leaves.filter(l => l.status === 'rejected').length
    };

    return (
        <PageWrapper
            title="Approval Izin & Cuti"
            subtitle="Kelola pengajuan izin dari pegawai"
        >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                    onClick={() => setFilter('pending')}
                    className={`card p-4 text-center transition-all ${filter === 'pending' ? 'ring-2 ring-warning-500' : ''}`}
                >
                    <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                    <p className="text-xs text-gray-500">Menunggu</p>
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`card p-4 text-center transition-all ${filter === 'approved' ? 'ring-2 ring-success-500' : ''}`}
                >
                    <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.approved}</p>
                    <p className="text-xs text-gray-500">Disetujui</p>
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`card p-4 text-center transition-all ${filter === 'rejected' ? 'ring-2 ring-danger-500' : ''}`}
                >
                    <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <X className="w-5 h-5 text-danger-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
                    <p className="text-xs text-gray-500">Ditolak</p>
                </button>
            </div>

            <Card padding="p-0">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <CardTitle>
                        {filter === 'pending' && 'Pengajuan Menunggu'}
                        {filter === 'approved' && 'Pengajuan Disetujui'}
                        {filter === 'rejected' && 'Pengajuan Ditolak'}
                        {filter === 'all' && 'Semua Pengajuan'}
                    </CardTitle>
                    <button
                        onClick={() => setFilter('all')}
                        className={`text-sm font-medium ${filter === 'all' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Lihat Semua
                    </button>
                </div>
                <CardContent className="p-5">
                    {filteredLeaves.length > 0 ? (
                        <div className="space-y-4">
                            {filteredLeaves.map((leave) => (
                                <div key={leave.id} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                                                    {leave.employee?.fullName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{leave.employee?.fullName}</p>
                                                    <p className="text-xs text-gray-500">{leave.employee?.position}</p>
                                                </div>
                                                <StatusBadge status={leave.status} />
                                            </div>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs">Jenis</p>
                                                    <p className="font-medium capitalize">{leave.type.replace('_', ' ')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Tanggal</p>
                                                    <p className="font-medium">
                                                        {formatDateShort(leave.startDate)} - {formatDateShort(leave.endDate)}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-gray-500 text-xs">Alasan</p>
                                                    <p className="font-medium">{leave.reason}</p>
                                                </div>
                                            </div>

                                            {leave.status !== 'pending' && leave.approver && (
                                                <p className="text-xs text-gray-400 mt-3">
                                                    {leave.status === 'approved' ? 'Disetujui' : 'Ditolak'} oleh {leave.approver.fullName}
                                                </p>
                                            )}
                                        </div>

                                        {leave.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleReject(leave.id)}
                                                    loading={loading[leave.id] === 'reject'}
                                                    disabled={loading[leave.id]}
                                                >
                                                    <X className="w-4 h-4" />
                                                    Tolak
                                                </Button>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleApprove(leave.id)}
                                                    loading={loading[leave.id] === 'approve'}
                                                    disabled={loading[leave.id]}
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Setujui
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Tidak ada pengajuan</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
