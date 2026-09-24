import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '' });
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    api.get('/auth/me').then(({ data }) =>
      setForm({ username: data.username, email: data.email }));
    api.get('/posts/mine').then(({ data }) => setPosts(data));
  }, []);

  const update = async () => {
    try {
      const { data } = await api.put('/auth/me', form);
      localStorage.setItem('user', JSON.stringify({
        id: data._id, username: data.username, email: data.email
      }));
      setMsg('Updated');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete your account and all posts?')) return;
    await api.delete('/auth/me');
    localStorage.clear();
    window.location.href = '/register';
  };

  return (
    <div>
      <div className="card">
        <h2>Profile</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {msg && <div className="meta">{msg}</div>}
          <div className="row">
            <button className="btn" onClick={update}>Update</button>
            <button className="btn danger" onClick={remove}>Delete</button>
          </div>
        </form>
      </div>
      <h3>Your posts</h3>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((p) => (
        <div className="card" key={p._id}>
          <h3>{p.title}</h3>
          <Link to={'/post/' + p._id}>Open</Link>
        </div>
      ))}
    </div>
  );
}
