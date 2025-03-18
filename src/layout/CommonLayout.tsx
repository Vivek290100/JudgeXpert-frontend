import Navbar from '@/components/layout/Navbar';
import { Outlet } from 'react-router-dom';

const CommonLayout = () => {
  return (
    <div className="common-layout">
      <Navbar />
      <div className="container mx-auto ">
        <Outlet />
      </div>
    </div>
  );
};

export default CommonLayout;
