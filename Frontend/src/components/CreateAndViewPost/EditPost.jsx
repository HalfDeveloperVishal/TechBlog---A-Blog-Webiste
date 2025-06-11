import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams(); // get post id from URL
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/createpost/posts/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPostData({
            title: data.title,
            category: data.category,
            description: data.description,
          });
        } else {
          toast.error('Failed to fetch post data.');
        }
      } catch (error) {
        toast.error('Error loading post.');
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/createpost/posts/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success('Post updated successfully!');
        navigate('/userpost'); // redirect to user posts page
      } else {
        const errorData = await response.json();
        toast.error(`Update failed: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Error updating post.');
    }
  };

  return (
    <div className="edit-post-container">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className="edit-post-form">
        <input
          type="text"
          name="title"
          value={postData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <select
          name="category"
          value={postData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="News">News</option>
        </select>
        <textarea
          name="description"
          value={postData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
