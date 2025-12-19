import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AttendanceHistory, AttendanceCard } from '../../components/attendance/AttendanceHistory';
import { attendanceStorage } from '../../utils/storage';
import { getCurrentMonthRange } from '../../utils/dateHelper';
import { Download, Calendar, Filter } from 'lucide-react';

export default function HistoryPage() {
    const { user } = useAuth();
    const [attendances, setAttendances] = useState([]);
    const [filteredAttendances, setFilteredAttendances] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

    useEffect(() => {
        if (user) {
            const userAttendances = attendanceStorage.getByUserId(user.id);
            const sorted = userAttendances.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAttendances(sorted);
            setFilteredAttendances(sorted);

            // Set default date range to current month
            const { start, end } = getCurrentMonthRange();
            setStartDate(start);
            setEndDate(end);
        }
    }, [user]);

    useEffect(() => {
        let filtered = [...attendances];

        if (startDate) {
            filtered = filtered.filter(a => a.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(a => a.date <= endDate);
        }

        setFilteredAttendances(filtered);
    }, [attendances, startDate, endDate]);

    const handleExport = () => {
        // Generate CSV content
        const headers = ['Tanggal', 'Masuk', 'Pulang', 'Status'];
        const rows = filteredAttendances.map(a => [
            a.date,
            a.clockInTime || '-',
            a.clockOutTime || '-',
            a.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `riwayat-absensi-${user.nip}.csv`;
        link.click();
    };

    const stats = {
        total: filteredAttendances.length,
        hadir: filteredAttendances.filter(a => a.status === 'hadir').length,
        terlambat: filteredAttendances.filter(a => a.status === 'terlambat').length,
        pulangCepat: filteredAttendances.filter(a => a.status === 'pulang_cepat').length
    };

    return (
        <PageWrapper
            title="Riwayat Absensi"
            subtitle="Lihat dan unduh riwayat kehadiran Anda"
        >
            {/* Filters */}
            <Card className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <Input
                            label="Dari Tanggal"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            icon={Calendar}
                        />
                        <Input
                            label="Sampai Tanggal"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            icon={Calendar}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                        >
                            <Filter className="w-4 h-4" />
                            {viewMode === 'table' ? 'Kartu' : 'Tabel'}
                        </Button>
                        <Button variant="primary" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Summary stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Hari</p>
                </Card>
                <Card className="p-4 text-center bg-success-50 border-success-200">
                    <p className="text-2xl font-bold text-success-600">{stats.hadir}</p>
                    <p className="text-xs text-success-600">Hadir</p>
                </Card>
                <Card className="p-4 text-center bg-warning-50 border-warning-200">
                    <p className="text-2xl font-bold text-warning-600">{stats.terlambat}</p>
                    <p className="text-xs text-warning-600">Terlambat</p>
                </Card>
                <Card className="p-4 text-center bg-danger-50 border-danger-200">
                    <p className="text-2xl font-bold text-danger-600">{stats.pulangCepat}</p>
                    <p className="text-xs text-danger-600">Pulang Cepat</p>
                </Card>
            </div>

            {/* Attendance list */}
            <Card padding="p-0">
                <div className="p-5 border-b border-gray-100">
                    <CardTitle>Data Absensi</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Menampilkan {filteredAttendances.length} data
                    </p>
                </div>
                <CardContent className="p-5">
                    {viewMode === 'table' ? (
                        <AttendanceHistory attendances={filteredAttendances} />
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAttendances.map((attendance) => (
                                <AttendanceCard key={attendance.id} attendance={attendance} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
