import React from 'react'
import Navbar from '../navbar/Navbar'
import LatestPosts from '../CreateAndViewPost/LatestPosts';
import Footer from '../Footer/Footer';

const Homepage = () => {
  return (
    <>
    <Navbar/> 
    <LatestPosts/>
    <Footer/>
    </>
  );
}

export default Homepage