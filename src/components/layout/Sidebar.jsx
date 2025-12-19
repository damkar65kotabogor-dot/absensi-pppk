import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Clock,
    FileText,
    History,
    Users,
    CheckSquare,
    BarChart3,
    Settings,
    Building2,
    X
} from 'lucide-react';

const employeeMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/attendance', icon: Clock, label: 'Absensi' },
    { path: '/leave-request', icon: FileText, label: 'Pengajuan Izin' },
    { path: '/history', icon: History, label: 'Riwayat' },
];

const adminMenuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/employees', icon: Users, label: 'Pegawai' },
    { path: '/admin/approvals', icon: CheckSquare, label: 'Approval Izin' },
    { path: '/admin/reports', icon: BarChart3, label: 'Laporan' },
    { path: '/admin/settings', icon: Settings, label: 'Pengaturan' },
];

export function Sidebar({ isOpen, onClose }) {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800">Absensi PPPK</h1>
                            <p className="text-xs text-gray-500">Sistem Kehadiran Digital</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* User info */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{user?.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.position}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin' && item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Role indicator */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <div className={`px-4 py-2 rounded-xl text-center text-sm font-medium ${isAdmin
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-primary-100 text-primary-700'
                        }`}>
                        {isAdmin ? '👑 Administrator' : '👤 Pegawai'}
                    </div>
                </div>
            </aside>
        </>
    );
}
