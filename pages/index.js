import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScrape = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProducts([]);
    setError('');

    try {
      // Panggil endpoint API Python
      const response = await fetch(`/api/scraper?keyword=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      
      setProducts(data.products || []);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Shopee Scraper</title>
        <meta name="description" content="Scrape Shopee products with Next.js and Python" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">📦 Shopee Product Scraper</h1>
          <p className="text-gray-600 mt-2">Built with Next.js, Tailwind CSS, and a Python Serverless API.</p>
        </div>
        
        {/* Form Input */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleScrape}>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
              Masukkan Kata Kunci Produk
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Contoh: laptop
                gaming"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 disabled:bg-gray-400"
              >
                {loading ? 'Mencari...' : 'Cari'}
              </button>
            </div>
          </form>
        </div>

        {/* Loading & Error State */}
        {loading && <div className="text-center mt-8">Loading...</div>}
        {error && <div className="text-center mt-8 text-red-500 bg-red-100 p-3 rounded-md max-w-2xl mx-auto">{error}</div>}

        {/* Hasil Scraping */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 && products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
                <p className="text-lg font-bold text-orange-500 mt-2">{product.price}</p>
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-4 bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Lihat Produk
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
