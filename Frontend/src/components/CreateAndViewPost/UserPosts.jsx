import React, { useEffect, useState, useContext } from "react";
import "./UserPosts.css";
import { AuthContext } from "../authcontext/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const categories = ['All', 'Technology', 'Lifestyle', 'Education', 'News'];

const UserPosts = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchUserPosts = async () => {
    const token = localStorage.getItem("access_token");
    try {
      let url = "http://127.0.0.1:8000/api/createpost/posts/";
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserPosts();
    }
  }, [isLoggedIn, selectedCategory]);

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("access_token");
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/createpost/posts/${postId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Post deleted successfully!");
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post");
    }
  };

  if (!isLoggedIn) {
    return <p className="not-logged-in">Please log in to view your posts.</p>;
  }

  return (
    <div className="user-posts-container">
      <div className="header-row">
        <h2>Your Posts</h2>
        <Link to="/create-post" className="create-post-button">
          + Create Post
        </Link>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label htmlFor="category-select">Filter by Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {posts.length === 0 ? (
        <p className="no-posts">No posts found.</p>
      ) : (
        <ul className="posts-list">
          {posts.map((post) => {
            const words = post.description.split(/\s+/);
            const shortDescription = words.slice(0, 50).join(" ");
            const createdDate = new Date(post.created_at);
            const formattedDate = createdDate.toLocaleDateString();
            const formattedTime = createdDate.toLocaleTimeString();

            return (
              <li key={post.id} className="post-card">
                <Link to={`/post/${post.id}`} className="post-title-link">
                  <h3>{post.title}</h3>
                </Link>
                <p>
                  <strong>Category:</strong> {post.category}
                </p>
                <p className="post-meta">
                  <small>
                    Created on: {formattedDate} at {formattedTime} &nbsp;
                    <i className="fas fa-comments"></i>{" "}
                    {post.comments_count || 0} Comments
                  </small>
                </p>
                <p>
                  {words.length > 50 ? `${shortDescription}...` : post.description}
                </p>
                <div className="button-group">
                  {words.length > 50 && (
                    <Link to={`/post/${post.id}`} className="read-more-link">
                      Read More
                    </Link>
                  )}
                  <Link to={`/editpost/${post.id}`} className="edit-button">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;
