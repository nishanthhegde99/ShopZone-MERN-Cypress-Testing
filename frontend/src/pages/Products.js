import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { productAPI } from '../utils/api';
import { wishlistAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ keyword, category, sort, page, minPrice, maxPrice, limit: 12 });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {} finally { setLoading(false); }
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (user) {
      wishlistAPI.get().then(({ data }) => {
        setWishlistIds(data.wishlist?.products?.map((p) => p._id || p) || []);
      }).catch(() => {});
    }
  }, [user]);

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value; else delete params[key];
    if (key !== 'page') delete params.page;
    setSearchParams(params);
  };

  const handleWishlistToggle = (productId) => {
    setWishlistIds((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };

  return (
    <div className="page" data-cy="products-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.2rem' }}>
            {category || keyword ? (category || `Results for "${keyword}"`) : 'All Products'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{total} products found</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setShowFilters(!showFilters)} data-cy="filter-toggle">
            <FiFilter /> Filters
          </button>
          <select className="form-input" style={{ width: 'auto', padding: '0.5rem 0.8rem' }} value={sort}
            onChange={(e) => setParam('sort', e.target.value)} data-cy="sort-select">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Filters */}
        {showFilters && (
          <aside className="filters-sidebar" style={{ display: 'block' }} data-cy="filters-sidebar">
            <div className="card" style={{ padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 700 }}>Filters</span>
                <button onClick={() => { setSearchParams({}); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear All</button>
              </div>

              <div className="filter-section">
                <div className="filter-title">Category</div>
                {CATEGORIES.map((c) => (
                  <label key={c} className="filter-option">
                    <input type="radio" name="category" checked={category === c} onChange={() => setParam('category', c)} data-cy={`category-${c}`} />
                    {c}
                  </label>
                ))}
                {category && <button onClick={() => setParam('category', '')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiX /> Clear</button>}
              </div>

              <div className="filter-section">
                <div className="filter-title">Price Range</div>
                <div className="price-range">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setParam('minPrice', e.target.value)} data-cy="min-price" />
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setParam('maxPrice', e.target.value)} data-cy="max-price" />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Products */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="products-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card" style={{ height: 340 }}>
                  <div className="skeleton" style={{ height: 220 }} />
                  <div style={{ padding: '1rem' }}>
                    <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 16, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <FiSearch style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <h3>No products found</h3>
              <p>Try different keywords or filters</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} wishlistIds={wishlistIds} onWishlistToggle={handleWishlistToggle} />
                ))}
              </div>
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  {[...Array(pages)].map((_, i) => (
                    <button key={i} onClick={() => setParam('page', i + 1)}
                      className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} data-cy={`page-${i + 1}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
