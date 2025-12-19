const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    primary: 'badge-primary',
    gray: 'badge-gray'
};

const statusMap = {
    hadir: { variant: 'success', label: 'Hadir' },
    terlambat: { variant: 'warning', label: 'Terlambat' },
    pulang_cepat: { variant: 'warning', label: 'Pulang Cepat' },
    izin: { variant: 'primary', label: 'Izin' },
    sakit: { variant: 'danger', label: 'Sakit' },
    cuti: { variant: 'gray', label: 'Cuti' },
    pending: { variant: 'warning', label: 'Menunggu' },
    approved: { variant: 'success', label: 'Disetujui' },
    rejected: { variant: 'danger', label: 'Ditolak' }
};

export function Badge({
    children,
    variant = 'primary',
    className = ''
}) {
    return (
        <span className={`badge ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

export function StatusBadge({ status, className = '' }) {
    const config = statusMap[status] || { variant: 'gray', label: status };

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}
