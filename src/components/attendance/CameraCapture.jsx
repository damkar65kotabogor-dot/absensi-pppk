import { useState, useRef, useCallback } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function CameraCapture({ onCapture, onCancel }) {
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                setStream(mediaStream);
            }
        } catch (err) {
            setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
            console.error('Camera error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const takePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip horizontally for selfie effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0);

        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(photoData);
        stopCamera();
    }, [stopCamera]);

    const retake = useCallback(() => {
        setPhoto(null);
        startCamera();
    }, [startCamera]);

    const confirmPhoto = useCallback(() => {
        if (photo) {
            onCapture(photo);
        }
    }, [photo, onCapture]);

    const handleCancel = useCallback(() => {
        stopCamera();
        onCancel();
    }, [stopCamera, onCancel]);

    // Start camera on mount
    useState(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    return (
        <div className="flex flex-col items-center">
            {/* Camera/Photo display */}
            <div className="relative w-full max-w-sm aspect-[4/3] bg-gray-900 rounded-2xl overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4 text-center">
                        <Camera className="w-12 h-12 text-gray-500 mb-3" />
                        <p className="text-sm text-gray-400">{error}</p>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-3"
                            onClick={startCamera}
                        >
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {!loading && !error && !photo && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                        onLoadedMetadata={() => setLoading(false)}
                    />
                )}

                {photo && (
                    <img
                        src={photo}
                        alt="Captured"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Overlay guide */}
                {!loading && !error && !photo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-40 h-52 border-2 border-dashed border-white/50 rounded-full" />
                    </div>
                )}
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Instructions */}
            <p className="text-sm text-gray-500 mt-3 text-center">
                {photo
                    ? 'Pastikan foto sudah jelas dan wajah terlihat'
                    : 'Posisikan wajah Anda di dalam lingkaran'}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
                {!photo ? (
                    <>
                        <Button variant="secondary" onClick={handleCancel}>
                            <X className="w-4 h-4" />
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={takePhoto}
                            disabled={loading || !!error}
                        >
                            <Camera className="w-4 h-4" />
                            Ambil Foto
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="secondary" onClick={retake}>
                            <RefreshCw className="w-4 h-4" />
                            Ulangi
                        </Button>
                        <Button variant="success" onClick={confirmPhoto}>
                            <Check className="w-4 h-4" />
                            Gunakan Foto Ini
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
