import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function PageWrapper({ children, title, subtitle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    {/* Page header */}
                    {(title || subtitle) && (
                        <div className="mb-6">
                            {title && (
                                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                            )}
                            {subtitle && (
                                <p className="text-gray-500 mt-1">{subtitle}</p>
                            )}
                        </div>
                    )}

                    {/* Page content */}
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
