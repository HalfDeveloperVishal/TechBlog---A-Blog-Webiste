import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/createpost/posts/search/?search=${query}`);
        if (response.ok) {
          const data = await response.json();
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setResults(data);
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="user-posts-container">
      <div className="header-row">
        <h2>Search Results for "{query}"</h2>
      </div>

      {results.length === 0 ? (
        <p className="no-posts">No posts found.</p>
      ) : (
        <ul className="posts-list">
          {results.map((post) => {
            const words = post.description.split(/\s+/);
            const shortDescription = words.slice(0, 50).join(' ');
            const createdDate = new Date(post.created_at);
            const formattedDate = createdDate.toLocaleDateString();
            const formattedTime = createdDate.toLocaleTimeString();

            return (
              <li key={post.id} className="post-card">
                <Link to={`/post/${post.id}`} className="post-title-link">
                  <h3>{post.title}</h3>
                </Link>
                <p><strong>Category:</strong> {post.category}</p>
                <p className="post-meta">
                  <small>
                    Created on: {formattedDate} at {formattedTime} &nbsp;&nbsp;
                    <i className="fas fa-comments"></i> {post.comments_count || 0} Comments &nbsp;&nbsp;
                    <Heart
                      size={16}
                      style={{ verticalAlign: 'middle', marginLeft: '8px', marginRight: '4px' }}
                    /> {post.likes_count || 0}
                  </small>
                </p>
                <p>
                  {words.length > 50 ? `${shortDescription}...` : post.description}
                </p>
                <div className="button-group">
                  {words.length > 50 && (
                    <Link to='/post/:id' className="read-more-link">Read More</Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
