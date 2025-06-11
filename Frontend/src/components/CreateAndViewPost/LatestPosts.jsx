import React, { useContext, useEffect, useState } from 'react';
import './LatestPosts.css';
import { Plus, FileText, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../authcontext/AuthContext';

const categories = ['All', 'Technology', 'Lifestyle', 'Education', 'News'];

const LatestPosts = () => {
  const { isLoggedIn, isChecking } = useContext(AuthContext);
  const [allPosts, setAllPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        let url = 'http://127.0.0.1:8000/api/createpost/all-posts/';
        const params = new URLSearchParams();

        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setAllPosts(sortedData);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchAllPosts();
  }, [selectedCategory]);

  if (isChecking) return null;

  return (
    <div className="latest-posts-container">
      <div className="header-and-buttons">
        <div className="latest-posts-text">
          <h2>Latest Posts</h2>
          <p>Discover our latest articles and insights</p>
        </div>

        {isLoggedIn && (
          <div className="action-buttons">
            <button className="btn" onClick={() => navigate('/create-post')}>
              <Plus size={16} />
              <span>New Post</span>
            </button>
            <button className="btn" onClick={() => navigate('/userpost')}>
              <FileText size={16} />
              <span>My Posts</span>
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Dropdown */}
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

      <div className="all-posts-section">
        {allPosts.length === 0 ? (
          <p className="no-posts">No blog posts available.</p>
        ) : (
          <ul className="all-posts-list">
            {allPosts.map((post) => {
              const createdDate = new Date(post.created_at).toLocaleString();
              const words = post.description?.split(/\s+/) || [];
              const shortDescription = words.slice(0, 50).join(' ');

              return (
                <li key={post.id} className="post-card">
                  <Link to={`/post/${post.id}`} className="post-title-link">
                    <h3>{post.title}</h3>
                  </Link>

                  <p><strong>Category:</strong> {post.category}</p>
                  <p>{words.length > 50 ? `${shortDescription}...` : post.description}</p>

                  <div className="post-meta">
                    <span className="meta-item">
                      <i className="fas fa-user"></i> {post.username || 'Unknown'}
                    </span>

                    <span className="meta-item">
                      <i className="fas fa-calendar-alt"></i> {createdDate}
                    </span>

                    <span className="meta-item">
                      <i className="fas fa-comments"></i> {post.comments_count ?? 0}
                    </span>

                    <span className="meta-item">
                      <Heart size={16} style={{ marginRight: '4px' }} /> {post.likes_count ?? 0}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LatestPosts;
