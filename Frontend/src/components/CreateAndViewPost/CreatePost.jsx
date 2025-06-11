import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // <-- Import useNavigate
import './CreatePost.css';
import { toast } from 'react-toastify';
import { AuthContext } from '../authcontext/AuthContext';

const CreatePost = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); // <-- Initialize navigate

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('You must be logged in to create a post.');
      return;
    }

    const postData = { title, category, description };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/createpost/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success('Post created successfully!');
        setTitle('');
        setCategory('');
        setDescription('');
        navigate('/userpost');  // <-- Redirect to user post page here
      } else {
        const errorData = await response.json();
        toast.error(`Failed to create post: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      toast.error('Error submitting post.');
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return <p className="not-logged-in">Please log in to create a post.</p>;
  }

  return (
    <div className="new-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="new-post-form">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="News">News</option>
        </select>

        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button type="submit">Submit Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
