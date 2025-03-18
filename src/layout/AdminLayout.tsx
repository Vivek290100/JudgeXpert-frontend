import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout flex h-screen overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;