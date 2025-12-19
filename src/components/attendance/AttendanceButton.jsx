import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MapPin, AlertCircle } from 'lucide-react';
import { formatTimeWithSeconds } from '../../utils/dateHelper';

export function AttendanceButton({
    type = 'checkin', // 'checkin' or 'checkout'
    disabled = false,
    locationStatus = null, // 'loading', 'valid', 'invalid', null
    locationMessage = '',
    onClick
}) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isCheckIn = type === 'checkin';

    const buttonClass = isCheckIn
        ? 'attendance-btn attendance-btn-checkin'
        : 'attendance-btn attendance-btn-checkout';

    const getLocationIcon = () => {
        switch (locationStatus) {
            case 'loading':
                return (
                    <div className="animate-spin">
                        <MapPin className="w-5 h-5" />
                    </div>
                );
            case 'valid':
                return <CheckCircle className="w-5 h-5 text-success-500" />;
            case 'invalid':
                return <XCircle className="w-5 h-5 text-danger-500" />;
            default:
                return <MapPin className="w-5 h-5 text-gray-400" />;
        }
    };

    const getLocationColor = () => {
        switch (locationStatus) {
            case 'valid':
                return 'bg-success-100 text-success-700';
            case 'invalid':
                return 'bg-danger-100 text-danger-700';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Time display */}
            <div className="text-center mb-6">
                <p className="text-4xl font-bold text-gray-800 tabular-nums">
                    {formatTimeWithSeconds(currentTime)}
                </p>
                <p className="text-gray-500 mt-1">
                    {currentTime.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </p>
            </div>

            {/* Main button */}
            <button
                onClick={onClick}
                disabled={disabled || locationStatus === 'invalid' || locationStatus === 'loading'}
                className={`${buttonClass} ${(disabled || locationStatus === 'invalid') ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <Clock className="w-12 h-12 mb-2" />
                <span>{isCheckIn ? 'ABSEN MASUK' : 'ABSEN PULANG'}</span>
            </button>

            {/* Location status */}
            <div className={`mt-6 px-4 py-2 rounded-xl flex items-center gap-2 ${getLocationColor()}`}>
                {getLocationIcon()}
                <span className="text-sm font-medium">
                    {locationStatus === 'loading'
                        ? 'Mengambil lokasi...'
                        : locationMessage || 'Klik untuk mendapatkan lokasi'
                    }
                </span>
            </div>

            {/* Warning if location invalid */}
            {locationStatus === 'invalid' && (
                <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-xl flex items-start gap-3 max-w-sm">
                    <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-warning-700">Lokasi Tidak Valid</p>
                        <p className="text-xs text-warning-600 mt-1">
                            Anda berada di luar area kantor. Silakan mendekat ke lokasi kantor untuk melakukan absensi.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
