import { useEffect, useState } from 'react';
import { request } from '../api';

const emptyPlan = { name: '', type: 'VPS', ram: '', cpu: '', storage: '', priceInr: '', features: '' };

export default function AdminPage({ auth }) {
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [links, setLinks] = useState([]);
  const [currency, setCurrency] = useState({ usd: 0.012, eur: 0.011 });
  const [webhook, setWebhook] = useState('');
  const [planForm, setPlanForm] = useState(emptyPlan);

  async function load() {
    const [p, o, r, l, c, w] = await Promise.all([
      request('/plans'),
      request('/orders', { token: auth.token }),
      request('/reviews'),
      request('/settings/links'),
      request('/settings/currencies'),
      request('/settings/webhook', { token: auth.token })
    ]);
    setPlans(p);
    setOrders(o);
    setReviews(r);
    setLinks(l);
    setCurrency({ usd: c.usd, eur: c.eur });
    setWebhook(w.value);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="grid">
      <section className="card">
        <h3>Create Plan</h3>
        {Object.keys(emptyPlan).map((k) => (
          <input key={k} placeholder={k} value={planForm[k]} onChange={(e) => setPlanForm({ ...planForm, [k]: e.target.value })} />
        ))}
        <button
          onClick={async () => {
            await request('/plans', { method: 'POST', token: auth.token, body: planForm });
            setPlanForm(emptyPlan);
            load();
          }}
        >
          Add Plan
        </button>
        {plans.map((plan) => (
          <p key={plan.id}>
            {plan.name} <button onClick={async () => (await request(`/plans/${plan.id}`, { method: 'DELETE', token: auth.token }), load())}>Delete</button>
          </p>
        ))}
      </section>

      <section className="card">
        <h3>Orders</h3>
        {orders.map((order) => (
          <div key={order.id}>
            #{order.id} {order.user.email} - {order.plan.name} - {order.status}
            <button onClick={async () => (await request(`/orders/${order.id}/status`, { method: 'PATCH', token: auth.token, body: { status: 'APPROVED' } }), load())}>Approve</button>
            <button onClick={async () => (await request(`/orders/${order.id}/status`, { method: 'PATCH', token: auth.token, body: { status: 'REJECTED' } }), load())}>Reject</button>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>Reviews</h3>
        {reviews.map((review) => (
          <p key={review.id}>
            {review.user.username}: {review.message}
            <button onClick={async () => (await request(`/reviews/${review.id}`, { method: 'DELETE', token: auth.token }), load())}>Delete</button>
          </p>
        ))}
      </section>

      <section className="card">
        <h3>Links</h3>
        {links.map((link) => (
          <div key={link.key}>
            <input
              value={link.url}
              onChange={(e) => setLinks(links.map((x) => (x.key === link.key ? { ...x, url: e.target.value } : x)))}
            />
            <button onClick={async () => request(`/settings/links/${link.key}`, { method: 'PUT', token: auth.token, body: link })}>Save</button>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>Currencies & Webhook</h3>
        <input value={currency.usd} onChange={(e) => setCurrency({ ...currency, usd: e.target.value })} />
        <input value={currency.eur} onChange={(e) => setCurrency({ ...currency, eur: e.target.value })} />
        <button onClick={() => request('/settings/currencies', { method: 'PUT', token: auth.token, body: currency })}>Save Rates</button>
        <input value={webhook} onChange={(e) => setWebhook(e.target.value)} placeholder="Discord webhook URL" />
        <button onClick={() => request('/settings/webhook', { method: 'PUT', token: auth.token, body: { value: webhook } })}>Save Webhook</button>
      </section>
    </main>
  );
}
