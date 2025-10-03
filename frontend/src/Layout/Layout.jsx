import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBg from '../Components/SideBg';

export default function Layout() {
  return (
    <div className="w-full">
  <div className='container w-11/12 mx-auto'>
        {/* Main content */}
    <div className='grid grid-cols-1 lg:grid-cols-2 my-5 lg:my-30'>
        <div className="">
        <Outlet />
      </div>

      {/* Side background */}
    <div>
  <SideBg />
</div>

    </div>
  </div>
    </div>
  );
}
