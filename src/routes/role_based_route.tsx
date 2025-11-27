import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

interface RoleBasedRouteProps {
    allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
    const { accessToken, role, isLoading } = useAuth();

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (role && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleBasedRoute;
