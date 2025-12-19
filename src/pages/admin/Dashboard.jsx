import { useState, useEffect } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { attendanceStorage, userStorage, leaveStorage } from '../../utils/storage';
import { formatDateShort, getCurrentDateString, getGreeting } from '../../utils/dateHelper';
import {
    Users,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    FileText,
    LogIn,
    LogOut
} from 'lucide-react';

export default function AdminDashboard() {
    const [todayAttendances, setTodayAttendances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        lateToday: 0,
        absentToday: 0
    });

    useEffect(() => {
        // Get all employees (non-admin)
        const allEmployees = userStorage.getAll().filter(u => u.role === 'employee');
        setEmployees(allEmployees);

        // Get today's attendances
        const today = getCurrentDateString();
        const todayData = attendanceStorage.getByDate(today);

        // Enrich with employee data
        const enrichedAttendances = todayData.map(a => ({
            ...a,
            employee: allEmployees.find(e => e.id === a.userId)
        }));
        setTodayAttendances(enrichedAttendances);

        // Get pending leaves
        const pending = leaveStorage.getPending();
        const enrichedLeaves = pending.map(l => ({
            ...l,
            employee: allEmployees.find(e => e.id === l.userId)
        }));
        setPendingLeaves(enrichedLeaves);

        // Calculate stats
        const presentIds = todayData.map(a => a.userId);
        setStats({
            totalEmployees: allEmployees.length,
            presentToday: todayData.length,
            lateToday: todayData.filter(a => a.status === 'terlambat').length,
            absentToday: allEmployees.length - todayData.length
        });
    }, []);

    return (
        <PageWrapper
            title={`${getGreeting()}, Admin!`}
            subtitle="Pantau kehadiran pegawai secara real-time"
        >
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Pegawai"
                    value={stats.totalEmployees}
                    icon={Users}
                    variant="primary"
                />
                <StatCard
                    title="Hadir Hari Ini"
                    value={stats.presentToday}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatCard
                    title="Terlambat"
                    value={stats.lateToday}
                    icon={Clock}
                    variant="warning"
                />
                <StatCard
                    title="Belum Absen"
                    value={stats.absentToday}
                    icon={XCircle}
                    variant="danger"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Live attendance */}
                <div className="lg:col-span-2">
                    <Card padding="p-0">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <CardTitle>Kehadiran Hari Ini</CardTitle>
                                <p className="text-sm text-gray-500 mt-1">
                                    {formatDateShort(new Date())}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                                <span className="text-sm text-success-600 font-medium">Live</span>
                            </div>
                        </div>
                        <CardContent className="p-5">
                            {todayAttendances.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Pegawai</th>
                                                <th>Masuk</th>
                                                <th>Pulang</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todayAttendances.map((attendance) => (
                                                <tr key={attendance.id}>
                                                    <td>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                                                                {attendance.employee?.fullName?.charAt(0) || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800">
                                                                    {attendance.employee?.fullName || 'Unknown'}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {attendance.employee?.position}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {attendance.clockInTime ? (
                                                            <div className="flex items-center gap-2">
                                                                <LogIn className="w-4 h-4 text-success-500" />
                                                                <span className="font-medium">{attendance.clockInTime}</span>
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td>
                                                        {attendance.clockOutTime ? (
                                                            <div className="flex items-center gap-2">
                                                                <LogOut className="w-4 h-4 text-primary-500" />
                                                                <span className="font-medium">{attendance.clockOutTime}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">Belum</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <StatusBadge status={attendance.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Belum ada yang absen hari ini</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pending approvals */}
                <div>
                    <Card padding="p-0">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <CardTitle>Perlu Persetujuan</CardTitle>
                            {pendingLeaves.length > 0 && (
                                <span className="w-6 h-6 bg-warning-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {pendingLeaves.length}
                                </span>
                            )}
                        </div>
                        <CardContent className="p-5">
                            {pendingLeaves.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingLeaves.slice(0, 5).map((leave) => (
                                        <div key={leave.id} className="p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {leave.employee?.fullName}
                                                    </p>
                                                    <p className="text-xs text-primary-600 capitalize">
                                                        {leave.type.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <StatusBadge status="pending" />
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {formatDateShort(leave.startDate)} - {formatDateShort(leave.endDate)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Tidak ada pengajuan pending</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Absent employees */}
                    {stats.absentToday > 0 && (
                        <Card className="mt-6 bg-danger-50 border-danger-200">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-danger-500 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-danger-800">Belum Absen</p>
                                    <p className="text-sm text-danger-700 mt-1">
                                        {stats.absentToday} pegawai belum melakukan absensi hari ini.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
