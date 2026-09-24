import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const me = JSON.parse(localStorage.getItem('user') || 'null');

  const load = async () => {
    const p = await api.get('/posts/' + id);
    const c = await api.get('/posts/' + id + '/comments');
    setPost(p.data);
    setComments(c.data);
  };

  useEffect(() => { load(); }, [id]);

  const addComment = async () => {
    if (!text.trim()) return;
    await api.post('/posts/' + id + '/comments', { text });
    setText('');
    load();
  };

  const delComment = async (cid) => {
    await api.delete('/comments/' + cid);
    load();
  };

  const delPost = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete('/posts/' + id);
    navigate('/');
  };

  if (!post) return <p>Loading...</p>;
  const mine = me && post.author?._id === me.id;

  return (
    <div>
      <div className="card">
        {post.image && <img src={post.image} alt={post.title} />}
        <h2>{post.title}</h2>
        <div className="meta">
          @{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <div>{post.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        <p>{post.description}</p>
        {mine && (
          <div className="row">
            <Link to={'/edit/' + id}><button className="btn">Edit</button></Link>
            <button className="btn danger" onClick={delPost}>Delete</button>
          </div>
        )}
      </div>

      <h3>Comments ({comments.length})</h3>
      {comments.map((c) => (
        <div className="card" key={c._id}>
          <div className="meta">
            @{c.author?.username} · {new Date(c.createdAt).toLocaleString()}
          </div>
          <div>{c.text}</div>
          {me && c.author?._id === me.id && (
            <button className="btn danger" style={{ marginTop: 8 }}
              onClick={() => delComment(c._id)}>Delete</button>
          )}
        </div>
      ))}

      {me ? (
        <div className="card">
          <form onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Write a comment" value={text}
              onChange={(e) => setText(e.target.value)} />
            <button className="btn" onClick={addComment}>Add Comment</button>
          </form>
        </div>
      ) : (
        <p><Link to="/login">Login</Link> to comment.</p>
      )}
    </div>
  );
}
