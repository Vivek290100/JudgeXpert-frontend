// import { useState } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import AdminSidebar from '@/components/layout/AdminSidebar';
// import { Menu } from 'lucide-react';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   // Ensure all paths are in lowercase for case-insensitive matching
//   const validAdminRoutes = ['/admin/dashboard', '/admin/users'];
//   const showSidebar = validAdminRoutes.includes(location.pathname.toLowerCase());

//   return (
//     <div className="admin-layout flex h-screen overflow-hidden bg-[#13131a]">
//       {showSidebar && <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
//       <div className="admin-content flex-1 p-4 h-full overflow-auto">
//         {!sidebarOpen && showSidebar && (
//           <button
//             onClick={toggleSidebar}
//             className="fixed top-4 left-4 z-20 bg-[#1c1c25] p-2 rounded-lg text-[#a5f3fc] md:hidden"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         )}
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;



import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="admin-layout flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;