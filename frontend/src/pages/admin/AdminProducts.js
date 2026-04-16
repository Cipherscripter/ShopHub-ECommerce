import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';
import Pagination from '../../components/common/Pagination';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.keyword = search;
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Products ({total})</h1>
          <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
        </div>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search products..."
            className="form-control"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.images[0]?.url || 'https://via.placeholder.com/50'}
                        alt={product.name}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius)' }}
                      />
                    </td>
                    <td>
                      <Link to={`/products/${product._id}`} style={{ fontWeight: 500 }}>
                        {product.name}
                      </Link>
                    </td>
                    <td>{product.category}</td>
                    <td>₹{product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.stock === 0 ? 'badge badge-danger' : product.stock < 10 ? 'badge badge-warning' : 'badge badge-success'}>
                        {product.stock}
                      </span>
                    </td>
                    <td>⭐ {product.rating} ({product.numReviews})</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={deleting === product._id}
                        >
                          {deleting === product._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default AdminProducts;
