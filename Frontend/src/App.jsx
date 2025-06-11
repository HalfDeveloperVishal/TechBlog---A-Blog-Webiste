import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import Homepage from './components/Homepage/Homepage';
import { AuthProvider } from './components/authcontext/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './components/CreateAndViewPost/CreatePost';
import MainLayout from './components/MainLayout/MainLayout';
import UserPosts from './components/CreateAndViewPost/UserPosts';
import EditPost from './components/CreateAndViewPost/EditPost';
import BlogDetail from './components/CreateAndViewPost/BlogDetail';
import SearchResults from './components/CreateAndViewPost/SearchResults';
import Navbar2 from './components/navbar/Navbar2';
import MainLayout2 from './components/MainLayout/MainLayout2';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/create-post" element={<MainLayout><CreatePost/></MainLayout>}/>
          <Route path="/userpost" element={<MainLayout><UserPosts/></MainLayout>} />
          <Route path="/editpost/:id" element={<MainLayout2><EditPost/></MainLayout2>} />
          <Route path="/post/:id" element={<MainLayout2><BlogDetail/></MainLayout2>} />
          <Route path="/search" element={<MainLayout2><SearchResults/></MainLayout2>}/>
          <Route path="/navbar2" element={<Navbar2/>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
