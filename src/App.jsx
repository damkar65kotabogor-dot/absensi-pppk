import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/employee/Dashboard';
import AttendancePage from './pages/employee/Attendance';
import LeaveRequestPage from './pages/employee/LeaveRequest';
import HistoryPage from './pages/employee/History';
import AdminDashboard from './pages/admin/Dashboard';
import EmployeesPage from './pages/admin/Employees';
import LeaveApprovalPage from './pages/admin/LeaveApproval';
import ReportsPage from './pages/admin/Reports';
import SettingsPage from './pages/admin/Settings';

// Protected Route wrapper
function ProtectedRoute({ children, requireAdmin = false }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

// Redirect based on role
function RoleBasedRedirect() {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Root redirect */}
                    <Route path="/" element={<RoleBasedRedirect />} />

                    {/* Employee routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/attendance" element={
                        <ProtectedRoute>
                            <AttendancePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/leave-request" element={
                        <ProtectedRoute>
                            <LeaveRequestPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    } />

                    {/* Admin routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute requireAdmin>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/employees" element={
                        <ProtectedRoute requireAdmin>
                            <EmployeesPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/approvals" element={
                        <ProtectedRoute requireAdmin>
                            <LeaveApprovalPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/reports" element={
                        <ProtectedRoute requireAdmin>
                            <ReportsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/settings" element={
                        <ProtectedRoute requireAdmin>
                            <SettingsPage />
                        </ProtectedRoute>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
