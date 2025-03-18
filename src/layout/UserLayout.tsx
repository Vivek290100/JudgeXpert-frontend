import Navbar from '@/components/layout/Navbar';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <>
    <Navbar />
    <div className="user-layout">
      <div className="user-container mt-20 ">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default UserLayout;
