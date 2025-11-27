import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import SchedulePickup from '../components/dashboard/SchedulePickup';
import History from '../components/dashboard/History';
import Settings from '../components/dashboard/Settings';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/schedule" element={<SchedulePickup />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </DashboardLayout>
    );
}
