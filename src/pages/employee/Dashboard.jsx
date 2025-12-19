import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AttendanceCard } from '../../components/attendance/AttendanceHistory';
import { attendanceStorage, officeStorage } from '../../utils/storage';
import { getGreeting, getCurrentMonthRange, getCurrentDateString } from '../../utils/dateHelper';
import {
    Clock,
    Calendar,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronRight
} from 'lucide-react';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [recentAttendances, setRecentAttendances] = useState([]);
    const [stats, setStats] = useState({ total: 0, hadir: 0, terlambat: 0, pulangCepat: 0 });
    const [office, setOffice] = useState(null);

    useEffect(() => {
        if (user) {
            // Get today's attendance
            const today = getCurrentDateString();
            const todayData = attendanceStorage.getByUserAndDate(user.id, today);
            setTodayAttendance(todayData);

            // Get recent attendances (last 5)
            const userAttendances = attendanceStorage.getByUserId(user.id);
            const sorted = userAttendances.sort((a, b) => new Date(b.date) - new Date(a.date));
            setRecentAttendances(sorted.slice(0, 5));

            // Get monthly stats
            const { start, end } = getCurrentMonthRange();
            const monthlyStats = attendanceStorage.getStats(user.id, start, end);
            setStats(monthlyStats);

            // Get office
            const userOffice = officeStorage.getById(user.officeId);
            setOffice(userOffice);
        }
    }, [user]);

    const greeting = getGreeting();
    const { monthName } = getCurrentMonthRange();

    return (
        <PageWrapper
            title={`${greeting}, ${user?.fullName?.split(' ')[0]}!`}
            subtitle={`Selamat datang kembali di Sistem Absensi PPPK`}
        >
            {/* Quick attendance status */}
            <div className="mb-6">
                <Card className="p-6 bg-gradient-to-r from-primary-500 to-primary-700 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-100 font-medium">Status Hari Ini</p>
                            <div className="flex items-center gap-3 mt-2">
                                {todayAttendance?.clockInTime ? (
                                    <>
                                        <CheckCircle className="w-8 h-8" />
                                        <div>
                                            <p className="text-2xl font-bold">
                                                Masuk: {todayAttendance.clockInTime}
                                            </p>
                                            {todayAttendance.clockOutTime && (
                                                <p className="text-primary-100">
                                                    Pulang: {todayAttendance.clockOutTime}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-8 h-8 text-primary-200" />
                                        <div>
                                            <p className="text-2xl font-bold">Belum Absen</p>
                                            <p className="text-primary-100">Silakan lakukan absensi</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <Link to="/attendance">
                            <Button variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
                                {todayAttendance?.clockInTime && !todayAttendance?.clockOutTime
                                    ? 'Absen Pulang'
                                    : 'Absen Masuk'
                                }
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Kehadiran"
                    value={stats.total}
                    icon={Calendar}
                    variant="default"
                />
                <StatCard
                    title="Hadir Tepat Waktu"
                    value={stats.hadir}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatCard
                    title="Terlambat"
                    value={stats.terlambat}
                    icon={Clock}
                    variant="warning"
                />
                <StatCard
                    title="Pulang Cepat"
                    value={stats.pulangCepat}
                    icon={TrendingUp}
                    variant="danger"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent activity */}
                <div className="lg:col-span-2">
                    <Card padding="p-0" className="overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <CardTitle>Riwayat Absensi Terbaru</CardTitle>
                            <Link to="/history" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                Lihat Semua
                            </Link>
                        </div>
                        <CardContent className="p-5">
                            {recentAttendances.length > 0 ? (
                                <div className="space-y-3">
                                    {recentAttendances.map((attendance) => (
                                        <AttendanceCard key={attendance.id} attendance={attendance} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Belum ada riwayat absensi</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Info panel */}
                <div className="space-y-6">
                    {/* Office info */}
                    {office && (
                        <Card>
                            <CardTitle className="mb-4">Lokasi Kantor</CardTitle>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Nama Kantor</p>
                                    <p className="font-medium text-gray-800">{office.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Jam Kerja</p>
                                    <p className="font-medium text-gray-800">
                                        {office.workStart} - {office.workEnd}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Radius Absen</p>
                                    <p className="font-medium text-gray-800">{office.radius} meter</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Monthly summary */}
                    <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-success-500 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-success-800">Statistik {monthName}</p>
                                <p className="text-sm text-success-700 mt-1">
                                    Anda telah hadir {stats.hadir} hari tepat waktu dari total {stats.total} hari kerja.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Warning if late */}
                    {stats.terlambat > 0 && (
                        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-warning-500 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-warning-800">Perhatian</p>
                                    <p className="text-sm text-warning-700 mt-1">
                                        Anda memiliki {stats.terlambat} keterlambatan bulan ini. Usahakan hadir tepat waktu.
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
