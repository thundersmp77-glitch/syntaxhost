import { useEffect, useMemo, useState } from 'react';
import { request } from '../api';

export default function OrderPage({ auth }) {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ transactionId: '', paymentEmail: auth.user.email, screenshot: null });
  const [message, setMessage] = useState('');

  useEffect(() => {
    request('/plans').then((p) => {
      setPlans(p);
      setSelected(p[0] || null);
    });
  }, []);

  const qrPlaceholder = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=syntaxhost-payment';
  const amount = useMemo(() => selected?.priceInr || 0, [selected]);

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('planId', selected.id);
    fd.append('transactionId', form.transactionId);
    fd.append('paymentEmail', form.paymentEmail);
    fd.append('screenshot', form.screenshot);

    try {
      await request('/orders', { method: 'POST', token: auth.token, formData: fd });
      setMessage('Order submitted and marked pending.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (!selected) return <p className="card">Create plans first.</p>;

  return (
    <div className="grid two">
      <section className="card">
        <h3>Review Plan</h3>
        <select onChange={(e) => setSelected(plans.find((p) => p.id === Number(e.target.value)))} value={selected.id}>
          {plans.map((plan) => (
            <option value={plan.id} key={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
        <p>{selected.type}</p>
        <p>
          {selected.ram} / {selected.cpu} / {selected.storage}
        </p>
        <pre>{selected.features}</pre>
        <strong>Amount: ₹{amount}</strong>
      </section>

      <form className="card" onSubmit={submit}>
        <h3>Payment</h3>
        <img src={qrPlaceholder} alt="QR" width="180" />
        <p>Pay ₹{amount} and submit proof.</p>
        <input placeholder="Transaction ID" onChange={(e) => setForm({ ...form, transactionId: e.target.value })} required />
        <input placeholder="Payment Email" type="email" value={form.paymentEmail} onChange={(e) => setForm({ ...form, paymentEmail: e.target.value })} required />
        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, screenshot: e.target.files[0] })} required />
        <button>Submit Order</button>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  );
}
