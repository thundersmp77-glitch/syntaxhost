import { useEffect, useMemo, useState } from 'react';
import { request } from '../api';

export default function HomePage({ auth }) {
  const [plans, setPlans] = useState([]);
  const [rates, setRates] = useState({ inr: 1, usd: 0.012, eur: 0.011 });
  const [currency, setCurrency] = useState('inr');

  useEffect(() => {
    request('/plans').then(setPlans);
    request('/settings/currencies').then(setRates);
  }, []);

  const symbol = useMemo(() => ({ inr: '₹', usd: '$', eur: '€' }[currency]), [currency]);

  return (
    <main>
      <div className="card">
        <h2>Hosting Plans</h2>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="inr">INR</option>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>
      </div>

      <div className="grid">
        {plans.map((plan) => {
          const price = (plan.priceInr * rates[currency]).toFixed(2);
          return (
            <article className="card" key={plan.id}>
              <h3>{plan.name}</h3>
              <p>{plan.type}</p>
              <p>
                {plan.ram} RAM / {plan.cpu} CPU / {plan.storage} Storage
              </p>
              <pre>{plan.features}</pre>
              <strong>
                {symbol}
                {price}
              </strong>
              {auth ? <a href="/orders/new">Order now</a> : <small>Login to order</small>}
            </article>
          );
        })}
      </div>
    </main>
  );
}
