import { StatusBadge } from '../ui/Badge';
import { formatDateShort } from '../../utils/dateHelper';
import { Clock, LogIn, LogOut } from 'lucide-react';

export function AttendanceHistory({ attendances = [], showUser = false }) {
    if (attendances.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada data absensi</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        {showUser && <th>Pegawai</th>}
                        <th>Masuk</th>
                        <th>Pulang</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map((attendance) => (
                        <tr key={attendance.id}>
                            <td>
                                <span className="font-medium text-gray-800">
                                    {formatDateShort(attendance.date)}
                                </span>
                            </td>
                            {showUser && (
                                <td>
                                    <span className="text-gray-700">{attendance.userName || '-'}</span>
                                </td>
                            )}
                            <td>
                                {attendance.clockInTime ? (
                                    <div className="flex items-center gap-2">
                                        <LogIn className="w-4 h-4 text-success-500" />
                                        <span className="font-medium">{attendance.clockInTime}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td>
                                {attendance.clockOutTime ? (
                                    <div className="flex items-center gap-2">
                                        <LogOut className="w-4 h-4 text-primary-500" />
                                        <span className="font-medium">{attendance.clockOutTime}</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
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
    );
}

export function AttendanceCard({ attendance }) {
    return (
        <div className="card p-4 hover:shadow-card-hover">
            <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-800">
                    {formatDateShort(attendance.date)}
                </span>
                <StatusBadge status={attendance.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-success-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-success-600 mb-1">
                        <LogIn className="w-4 h-4" />
                        <span className="text-xs font-medium">Masuk</span>
                    </div>
                    <p className="text-lg font-bold text-success-700">
                        {attendance.clockInTime || '-'}
                    </p>
                </div>

                <div className="bg-primary-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-primary-600 mb-1">
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs font-medium">Pulang</span>
                    </div>
                    <p className="text-lg font-bold text-primary-700">
                        {attendance.clockOutTime || '-'}
                    </p>
                </div>
            </div>
        </div>
    );
}
