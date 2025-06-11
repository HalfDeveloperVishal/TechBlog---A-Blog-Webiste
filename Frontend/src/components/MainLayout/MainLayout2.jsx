import React from 'react';
import Navbar2 from '../navbar/Navbar2';

const MainLayout2 = ({ children }) => {
  return (
    <>
      <Navbar2/>
      <div className="main-content">{children}</div>
    </>
  );
};

export default MainLayout2;
