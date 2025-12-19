import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, User, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [nip, setNip] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!nip || !password) {
            setError('NIP dan password harus diisi');
            setLoading(false);
            return;
        }

        const result = await login(nip, password);

        if (result.success) {
            // Redirect based on role
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-300 rounded-full opacity-30 blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
                        <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Absensi PPPK</h1>
                    <p className="text-gray-500 mt-1">Sistem Kehadiran</p>
                </div>

                {/* Login form */}
                <div className="card p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Masuk ke Akun</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Nomor Induk Pegawai (NIP)"
                            type="text"
                            icon={User}
                            placeholder="Masukkan NIP"
                            value={nip}
                            onChange={(e) => setNip(e.target.value)}
                            error={error && !nip ? 'NIP harus diisi' : ''}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                icon={Lock}
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={error && !password ? 'Password harus diisi' : ''}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-danger-50 border border-danger-200 rounded-xl">
                                <p className="text-sm text-danger-600">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={loading}
                        >
                            Masuk
                        </Button>
                    </form>

                    {/* Demo accounts */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center mb-3">SELAMAT DATANG</p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    © 2024 Sistem Absensi PPPK. All rights reserved.
                </p>
            </div>
        </div>
    );
}
