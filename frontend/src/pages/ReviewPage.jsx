import { useEffect, useState } from 'react';
import { request } from '../api';

export default function ReviewPage({ auth }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ message: '', rating: 5 });

  async function load() {
    const data = await request('/reviews');
    setReviews(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    await request('/reviews', { method: 'POST', token: auth.token, body: form });
    setForm({ message: '', rating: 5 });
    load();
  }

  return (
    <main>
      {auth ? (
        <form className="card" onSubmit={submit}>
          <h3>Add review</h3>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          <button>Post</button>
        </form>
      ) : (
        <p className="card">Login to add a review.</p>
      )}

      <div className="grid">
        {reviews.map((r) => (
          <article className="card" key={r.id}>
            <strong>{r.user.username}</strong>
            <p>{r.message}</p>
            <p>Rating: {r.rating}/5</p>
          </article>
        ))}
      </div>
    </main>
  );
}
