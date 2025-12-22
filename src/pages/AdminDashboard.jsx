import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import PickupManagement from '../components/admin/PickupManagement';
import AdminSettings from '../components/admin/AdminSettings';
import HomepageSettings from '../components/admin/HomepageSettings';

export default function AdminDashboard() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<AdminOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="pickups" element={<PickupManagement />} />
                <Route path="homepage" element={<HomepageSettings />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
        </Routes>
    );
}
