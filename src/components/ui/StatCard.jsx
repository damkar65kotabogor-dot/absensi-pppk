export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    variant = 'default',
    className = ''
}) {
    const variants = {
        default: 'bg-white',
        primary: 'bg-gradient-primary text-white',
        success: 'bg-gradient-success text-white',
        warning: 'bg-gradient-warning text-white',
        danger: 'bg-gradient-danger text-white'
    };

    const iconBg = {
        default: 'bg-primary-100 text-primary-600',
        primary: 'bg-white/20 text-white',
        success: 'bg-white/20 text-white',
        warning: 'bg-white/20 text-white',
        danger: 'bg-white/20 text-white'
    };

    const textColor = variant === 'default' ? 'text-gray-600' : 'text-white/80';
    const valueColor = variant === 'default' ? 'text-gray-900' : 'text-white';

    return (
        <div className={`card p-5 ${variants[variant]} ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                    <p className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</p>
                    {trend && (
                        <div className={`flex items-center mt-2 text-sm ${trendUp ? 'text-success-500' : 'text-danger-500'
                            }`}>
                            {trendUp ? (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            )}
                            {trend}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${iconBg[variant]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
