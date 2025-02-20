// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\layout\CommonLayout.tsximport Navbar from '@/components/layout/Navbar';
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
