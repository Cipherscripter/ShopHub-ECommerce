import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';
import './ProductsPage.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive', 'Food', 'Other'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-rating',    label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);

  // Filter state derived from URL params
  const keyword  = searchParams.get('keyword')  || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort     = searchParams.get('sort')     || '-createdAt';
  const page     = parseInt(searchParams.get('page')) || 1;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (keyword)  params.keyword  = keyword;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    params.page = '1'; // Reset to page 1 on filter change
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = keyword || category || minPrice || maxPrice;

  return (
    <div className="page-wrapper">
      <div className="container products-layout">
        {/* ─── Sidebar Filters ──────────────────────────────────────────── */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {hasFilters && (
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* Category */}
          <div className="filter-group">
            <h4 className="filter-label">Category</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={!category}
                  onChange={() => updateParam('category', '')}
                />
                All Categories
              </label>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => updateParam('category', cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4 className="filter-label">Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="form-control"
                min="0"
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="form-control"
                min="0"
              />
            </div>
          </div>
        </aside>

        {/* ─── Main Content ─────────────────────────────────────────────── */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <p className="products-count">
              {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
              {keyword && <span> for "<strong>{keyword}</strong>"</span>}
            </p>

            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="form-control sort-select"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="active-filters">
              {keyword  && <span className="filter-tag">Search: {keyword} <button onClick={() => updateParam('keyword', '')}>✕</button></span>}
              {category && <span className="filter-tag">{category} <button onClick={() => updateParam('category', '')}>✕</button></span>}
              {minPrice && <span className="filter-tag">Min: ${minPrice} <button onClick={() => updateParam('minPrice', '')}>✕</button></span>}
              {maxPrice && <span className="filter-tag">Max: ${maxPrice} <button onClick={() => updateParam('maxPrice', '')}>✕</button></span>}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <Spinner />
          ) : products.length > 0 ? (
            <>
              <div className="grid-products">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={pages}
                onPageChange={(p) => updateParam('page', p.toString())}
              />
            </>
          ) : (
            <div className="no-products">
              <p>😕 No products found.</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
