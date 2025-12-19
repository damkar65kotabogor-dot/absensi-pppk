import { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { attendanceStorage, userStorage, officeStorage } from '../../utils/storage';
import { formatDateShort, getCurrentMonthRange } from '../../utils/dateHelper';
import { Download, FileSpreadsheet, Calendar, Filter, BarChart3 } from 'lucide-react';

export default function ReportsPage() {
    const [attendances, setAttendances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [offices, setOffices] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [selectedOffice, setSelectedOffice] = useState('all');

    useEffect(() => {
        const { start, end } = getCurrentMonthRange();
        setStartDate(start);
        setEndDate(end);

        setEmployees(userStorage.getAll().filter(u => u.role === 'employee'));
        setOffices(officeStorage.getAll());
        loadAttendances();
    }, []);

    useEffect(() => {
        loadAttendances();
    }, [startDate, endDate, selectedEmployee, selectedOffice]);

    const loadAttendances = () => {
        let all = attendanceStorage.getAll();
        const allUsers = userStorage.getAll();

        // Filter by date
        if (startDate) all = all.filter(a => a.date >= startDate);
        if (endDate) all = all.filter(a => a.date <= endDate);

        // Filter by employee
        if (selectedEmployee !== 'all') {
            all = all.filter(a => a.userId === parseInt(selectedEmployee));
        }

        // Filter by office
        if (selectedOffice !== 'all') {
            const officeUserIds = allUsers
                .filter(u => u.officeId === parseInt(selectedOffice))
                .map(u => u.id);
            all = all.filter(a => officeUserIds.includes(a.userId));
        }

        // Enrich with user data
        const enriched = all.map(a => ({
            ...a,
            employee: allUsers.find(u => u.id === a.userId)
        })).sort((a, b) => {
            if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
            return (a.employee?.fullName || '').localeCompare(b.employee?.fullName || '');
        });

        setAttendances(enriched);
    };

    const stats = {
        total: attendances.length,
        hadir: attendances.filter(a => a.status === 'hadir').length,
        terlambat: attendances.filter(a => a.status === 'terlambat').length,
        pulangCepat: attendances.filter(a => a.status === 'pulang_cepat').length
    };

    const handleExportCSV = () => {
        const headers = ['Tanggal', 'NIP', 'Nama', 'Jabatan', 'Masuk', 'Pulang', 'Status'];
        const rows = attendances.map(a => [
            a.date,
            a.employee?.nip || '',
            a.employee?.fullName || '',
            a.employee?.position || '',
            a.clockInTime || '-',
            a.clockOutTime || '-',
            a.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `laporan-absensi-${startDate}-${endDate}.csv`;
        link.click();
    };

    return (
        <PageWrapper
            title="Laporan Absensi"
            subtitle="Rekapitulasi dan export data kehadiran"
        >
            {/* Filters */}
            <Card className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Input
                        label="Dari Tanggal"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                        label="Sampai Tanggal"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <Select
                        label="Kantor"
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                        options={[
                            { value: 'all', label: 'Semua Kantor' },
                            ...offices.map(o => ({ value: o.id, label: o.name }))
                        ]}
                    />
                    <Select
                        label="Pegawai"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        options={[
                            { value: 'all', label: 'Semua Pegawai' },
                            ...employees.map(e => ({ value: e.id, label: e.fullName }))
                        ]}
                    />
                    <div className="flex items-end">
                        <Button variant="primary" className="w-full" onClick={handleExportCSV}>
                            <Download className="w-4 h-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Data</p>
                </Card>
                <Card className="p-4 text-center bg-success-50 border-success-200">
                    <p className="text-2xl font-bold text-success-600">{stats.hadir}</p>
                    <p className="text-xs text-success-600">Hadir Tepat Waktu</p>
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

            {/* Data table */}
            <Card padding="p-0">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <CardTitle>Data Absensi</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Menampilkan {attendances.length} data
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BarChart3 className="w-4 h-4" />
                        <span>{formatDateShort(startDate)} - {formatDateShort(endDate)}</span>
                    </div>
                </div>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>NIP</th>
                                    <th>Nama</th>
                                    <th>Jabatan</th>
                                    <th>Masuk</th>
                                    <th>Pulang</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendances.map((attendance) => (
                                    <tr key={attendance.id}>
                                        <td className="font-medium">{formatDateShort(attendance.date)}</td>
                                        <td className="font-mono text-sm">{attendance.employee?.nip || '-'}</td>
                                        <td>{attendance.employee?.fullName || '-'}</td>
                                        <td className="text-gray-500">{attendance.employee?.position || '-'}</td>
                                        <td className="font-medium">{attendance.clockInTime || '-'}</td>
                                        <td className="font-medium">{attendance.clockOutTime || '-'}</td>
                                        <td>
                                            <StatusBadge status={attendance.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {attendances.length === 0 && (
                            <div className="text-center py-12">
                                <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Tidak ada data untuk filter yang dipilih</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </PageWrapper>
    );
}
