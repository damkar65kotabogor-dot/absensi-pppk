import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    footer
}) {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-4xl'
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-xl animate-slide-up`}>
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                        )}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-5">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'danger',
    loading = false
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-gray-600">{message}</p>
            <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={onConfirm} loading={loading}>
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
}
