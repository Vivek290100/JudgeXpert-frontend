// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\layout\AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout flex">
      <AdminSidebar />
      <div className="admin-content flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
