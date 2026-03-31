import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { request } from './api';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ReviewPage from './pages/ReviewPage';
import AdminPage from './pages/AdminPage';
import OrderPage from './pages/OrderPage';

export default function App() {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem('syntax_auth') || 'null'));
  const [links, setLinks] = useState([]);

  useEffect(() => {
    request('/settings/links').then(setLinks).catch(() => setLinks([]));
  }, []);

  function onAuth(next) {
    setAuth(next);
    if (next) localStorage.setItem('syntax_auth', JSON.stringify(next));
    else localStorage.removeItem('syntax_auth');
  }

  return (
    <div className="app">
      <nav className="nav">
        <h1>SyntaxHost</h1>
        <div>
          <Link to="/">Plans</Link>
          <Link to="/reviews">Reviews</Link>
          {auth ? <Link to="/orders/new">Order</Link> : null}
          {auth?.user.role === 'ADMIN' ? <Link to="/admin">Admin</Link> : null}
          {auth ? <button onClick={() => onAuth(null)}>Logout</button> : <Link to="/auth">Login</Link>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage auth={auth} />} />
        <Route path="/auth" element={<AuthPage onAuth={onAuth} />} />
        <Route path="/reviews" element={<ReviewPage auth={auth} />} />
        <Route path="/orders/new" element={auth ? <OrderPage auth={auth} /> : <Navigate to="/auth" />} />
        <Route path="/admin" element={auth?.user.role === 'ADMIN' ? <AdminPage auth={auth} /> : <Navigate to="/" />} />
      </Routes>

      <footer>
        {links.map((link) => (
          <a href={link.url} target="_blank" key={link.key} rel="noreferrer">
            {link.label}
          </a>
        ))}
      </footer>
    </div>
  );
}
