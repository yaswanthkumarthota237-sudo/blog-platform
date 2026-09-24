import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts').then(({ data }) => setPosts(data));
  }, []);

  return (
    <div>
      <h2>Latest Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((p) => (
        <div className="card" key={p._id}>
          {p.image && <img src={p.image} alt={p.title} />}
          <h3>{p.title}</h3>
          <div className="meta">
            @{p.author?.username} · {new Date(p.createdAt).toLocaleDateString()}
          </div>
          <div>{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          <p>{p.description.slice(0, 120)}{p.description.length > 120 ? '...' : ''}</p>
          <Link to={'/post/' + p._id}>Read more</Link>
        </div>
      ))}
    </div>
  );
}
