import { useState } from 'react';
import axios from 'axios';

const CATEGORIES = [
  { label: 'Elektronik', value: 'elektronik' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Rumah Tangga', value: 'rumah-tangga' },
  // …tambah sesuai CATEGORY_MAP
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query || !category) {
      setError('Search term dan kategori wajib diisi.');
      return;
    }
    setError('');
    try {
      const { data } = await axios.get('/api/scrape', { params: { query, category } });
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengambil data.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopee Top Products Scraper</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
          required
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="p-2 border rounded"
          required
        >
          <option value="">Pilih kategori</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button type="submit" className="px-4 bg-blue-600 text-white rounded">Cari</button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover mb-2 rounded" />
            <h2 className="font-medium text-sm mb-1">{p.name}</h2>
            <p className="font-semibold">Rp {p.price.toLocaleString()}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
