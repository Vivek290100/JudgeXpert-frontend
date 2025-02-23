// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\layout\UserLayout.tsx
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
