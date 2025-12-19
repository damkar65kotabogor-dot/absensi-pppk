import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { formatTime } from '../../utils/dateHelper';

export function Header({ onMenuClick }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    <div>
                        <p className="text-sm text-gray-500">
                            {currentTime.toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                        <p className="text-xl font-semibold text-gray-800 tabular-nums">
                            {formatTime(currentTime)}
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                    </button>

                    {/* User dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user?.fullName?.charAt(0) || 'U'}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-700">
                                {user?.fullName?.split(' ')[0]}
                            </span>
                        </button>

                        {showDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDropdown(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-fade-in">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="font-medium text-gray-800">{user?.fullName}</p>
                                        <p className="text-xs text-gray-500">{user?.nip}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowDropdown(false);
                                            navigate('/profile');
                                        }}
                                        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        <User className="w-4 h-4" />
                                        Profil Saya
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-danger-500 hover:bg-danger-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
