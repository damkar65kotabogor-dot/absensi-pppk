import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AttendanceButton } from '../../components/attendance/AttendanceButton';
import { CameraCapture } from '../../components/attendance/CameraCapture';
import { attendanceStorage, officeStorage, settingsStorage } from '../../utils/storage';
import { getCurrentLocation, getMockLocation, validateGeofence } from '../../utils/geoHelper';
import { getCurrentDateString } from '../../utils/dateHelper';
import { CheckCircle, MapPin, Camera, AlertCircle } from 'lucide-react';

export default function AttendancePage() {
    const { user } = useAuth();
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [office, setOffice] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState(null);
    const [locationMessage, setLocationMessage] = useState('');
    const [showCamera, setShowCamera] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            // Get today's attendance
            const today = getCurrentDateString();
            const todayData = attendanceStorage.getByUserAndDate(user.id, today);
            setTodayAttendance(todayData);

            // Get office
            const userOffice = officeStorage.getById(user.officeId);
            setOffice(userOffice);
        }
    }, [user]);

    // Get location on mount
    useEffect(() => {
        if (office) {
            getLocation();
        }
    }, [office]);

    const getLocation = useCallback(async () => {
        setLocationStatus('loading');
        setLocationMessage('Mengambil lokasi...');

        try {
            const settings = settingsStorage.get();
            let userLocation;

            if (settings.allowMockLocation) {
                // Use mock location for testing
                userLocation = getMockLocation(office, true);
            } else {
                // Use real geolocation
                userLocation = await getCurrentLocation();
            }

            setLocation(userLocation);

            // Validate geofence
            const validation = validateGeofence(userLocation, office);

            if (validation.isValid) {
                setLocationStatus('valid');
                setLocationMessage(validation.message);
            } else {
                setLocationStatus('invalid');
                setLocationMessage(validation.message);
            }
        } catch (err) {
            setLocationStatus('invalid');
            setLocationMessage(err.message);
        }
    }, [office]);

    const handleAttendanceClick = () => {
        if (locationStatus === 'valid') {
            setShowCamera(true);
        }
    };

    const handleCapture = async (photoData) => {
        setShowCamera(false);
        setLoading(true);
        setError(null);

        try {
            const isCheckIn = !todayAttendance?.clockInTime;

            let result;
            if (isCheckIn) {
                result = attendanceStorage.clockIn(user.id, location, photoData);
            } else {
                result = attendanceStorage.clockOut(user.id, location, photoData);
            }

            if (result.success) {
                setTodayAttendance(result.data);
                setSuccess({
                    type: isCheckIn ? 'checkin' : 'checkout',
                    time: isCheckIn ? result.data.clockInTime : result.data.clockOutTime
                });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menyimpan absensi');
        } finally {
            setLoading(false);
        }
    };

    const isCheckIn = !todayAttendance?.clockInTime;
    const isCompleted = todayAttendance?.clockInTime && todayAttendance?.clockOutTime;

    return (
        <PageWrapper
            title="Absensi"
            subtitle="Lakukan absensi kehadiran Anda"
        >
            <div className="max-w-lg mx-auto">
                {/* Success message */}
                {success && (
                    <Card className="mb-6 bg-success-50 border border-success-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-success-500 rounded-xl">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-success-800">
                                    {success.type === 'checkin' ? 'Absen Masuk Berhasil!' : 'Absen Pulang Berhasil!'}
                                </p>
                                <p className="text-success-700">
                                    Tercatat pada pukul {success.time}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Error message */}
                {error && (
                    <Card className="mb-6 bg-danger-50 border border-danger-200">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-danger-500 rounded-xl">
                                <AlertCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-danger-800">Gagal Absen</p>
                                <p className="text-danger-700">{error}</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Main attendance card */}
                <Card className="text-center">
                    {isCompleted ? (
                        <div className="py-8">
                            <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-12 h-12 text-success-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Absensi Hari Ini Selesai
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Terima kasih, absensi Anda telah tercatat.
                            </p>
                            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                <div className="bg-success-50 rounded-xl p-4">
                                    <p className="text-xs text-success-600 font-medium">Masuk</p>
                                    <p className="text-xl font-bold text-success-700">{todayAttendance.clockInTime}</p>
                                </div>
                                <div className="bg-primary-50 rounded-xl p-4">
                                    <p className="text-xs text-primary-600 font-medium">Pulang</p>
                                    <p className="text-xl font-bold text-primary-700">{todayAttendance.clockOutTime}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <AttendanceButton
                            type={isCheckIn ? 'checkin' : 'checkout'}
                            disabled={loading || isCompleted}
                            locationStatus={locationStatus}
                            locationMessage={locationMessage}
                            onClick={handleAttendanceClick}
                        />
                    )}

                    {/* Refresh location button */}
                    {!isCompleted && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <Button
                                variant="ghost"
                                onClick={getLocation}
                                disabled={locationStatus === 'loading'}
                            >
                                <MapPin className="w-4 h-4" />
                                Perbarui Lokasi
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Office info */}
                {office && (
                    <Card className="mt-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 rounded-xl">
                                <MapPin className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{office.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{office.address}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Radius absen: {office.radius} meter | Jam kerja: {office.workStart} - {office.workEnd}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Camera modal */}
            <Modal
                isOpen={showCamera}
                onClose={() => setShowCamera(false)}
                title="Ambil Foto Selfie"
                size="lg"
            >
                <CameraCapture
                    onCapture={handleCapture}
                    onCancel={() => setShowCamera(false)}
                />
            </Modal>
        </PageWrapper>
    );
}
