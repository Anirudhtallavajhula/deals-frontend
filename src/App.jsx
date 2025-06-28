import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    axios.get(`${API}/categories`).then(res => setCategories(res.data));
    fetchProducts();
  }, []);

  const fetchProducts = (category = '') => {
    let url = `${API}/products`;
    if (category) url += `?category=${category}`;
    axios.get(url).then(res => setProducts(res.data));
  };

  const applyCoupon = () => {
    axios.get(`${API}/coupons/${couponCode}`)
      .then(res => setCoupon(res.data))
      .catch(() => setCoupon(null));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Deals & Coupons Finder</h1>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            fetchProducts(e.target.value);
          }}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />

        <button
          onClick={applyCoupon}
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Apply Coupon
        </button>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Name</th><th>Price</th><th>Category</th><th>Final Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const discounted = coupon && p.couponId === coupon.code
              ? (p.price * (1 - coupon.discount / 100)).toFixed(2)
              : p.price.toFixed(2);
            return (
              <tr key={p.id}
                  style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseOut={e => e.currentTarget.style.background = ''}>
                <td>{p.name}</td>
                <td>₹{p.price.toFixed(2)}</td>
                <td>{p.category}</td>
                <td>₹{discounted}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
