import React from 'react';
import Navbar from '../navbar/Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar/>
      <div className="main-content">{children}</div>
    </>
  );
};

export default MainLayout;
