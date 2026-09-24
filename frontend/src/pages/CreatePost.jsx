import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

export default function CreatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    if (id) {
      api.get('/posts/' + id).then(({ data }) => {
        setTitle(data.title);
        setDescription(data.description);
        setTags(data.tags);
      });
    }
  }, [id]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('tags', tags.join(','));
    if (image) fd.append('image', image);
    try {
      if (id) await api.put('/posts/' + id, fd);
      else await api.post('/posts', fd);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="card">
      <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title}
          onChange={(e) => setTitle(e.target.value)} required />
        <input type="file" accept="image/*"
          onChange={(e) => setImage(e.target.files[0])} />
        <div className="row">
          <input placeholder="Category tag" value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
          <button type="button" className="btn" onClick={addTag}>Add</button>
        </div>
        <div>
          {tags.map((t) => (
            <span className="tag" key={t}
              onClick={() => setTags(tags.filter((x) => x !== t))}>{t} ✕</span>
          ))}
        </div>
        <textarea rows="6" placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)} required />
        {error && <div className="error">{error}</div>}
        <button className="btn" type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}
