import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogDetail.css';
import { AuthContext } from '../authcontext/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      const token = localStorage.getItem('access_token');

      try {
        const [postRes, commentRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/createpost/post/${id}/`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }),
          fetch(`http://127.0.0.1:8000/api/createpost/comments/${id}/`),
        ]);

        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData);
        }

        if (commentRes.ok) {
          const commentData = await commentRes.json();
          setComments(commentData);
        }
      } catch (error) {
        console.error('Error fetching post or comments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!text.trim()) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/createpost/comments/${id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [newComment, ...prev]);
        setText('');
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    setLikeLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/createpost/posts/${id}/toggle-like/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost((prevPost) => ({
          ...prevPost,
          liked_by_user: data.liked,
        }));
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const createdDate = new Date(post.created_at).toLocaleString();

  return (
    <div className="blog-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h1 className="blog-title">{post.title}</h1>
      <p className="blog-category"><strong>Category:</strong> {post.category}</p>

      <div className="post-meta">
        <span className="meta-item">
          <i className="fas fa-user"></i> {post.username || 'Unknown'}
        </span>
        <span className="meta-item">
          <i className="fas fa-calendar-alt"></i> {createdDate}
        </span>

        {/* Show like button only when logged in */}
        {isLoggedIn && (
          <span
            className="meta-item like-toggle"
            style={{ cursor: 'pointer', color: post.liked_by_user ? 'red' : 'gray' }}
            onClick={handleLikeToggle}
            title={post.liked_by_user ? 'Unlike' : 'Like'}
          >
            <i className={post.liked_by_user ? 'fas fa-heart' : 'far fa-heart'}></i>
          </span>
        )}
      </div>

      <div className="blog-description">
        <p>{post.description}</p>
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <h3>Comments ({comments.length})</h3>

        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Write your comment here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <p className="login-message">Please log in to leave a comment.</p>
        )}

        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <strong>
                <i className="fas fa-user"></i> {comment.username}
              </strong>
              <p>{comment.content}</p>
              <span>
                <i className="fas fa-calendar-alt"></i> {new Date(comment.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogDetail;
