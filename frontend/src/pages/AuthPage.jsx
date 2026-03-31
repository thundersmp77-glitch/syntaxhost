import { useState } from 'react';
import { request } from '../api';
import { useNavigate } from 'react-router-dom';

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await request(`/auth/${mode === 'login' ? 'login' : 'signup'}`, { method: 'POST', body: form });
      onAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Login' : 'Signup'}</h2>
      {mode === 'signup' && <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />}
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error ? <p>{error}</p> : null}
      <button>Submit</button>
      <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        Switch to {mode === 'login' ? 'signup' : 'login'}
      </button>
    </form>
  );
}
