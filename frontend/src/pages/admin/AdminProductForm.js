import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Automotive', 'Food', 'Other'];

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name:          '',
    description:   '',
    price:         '',
    discountPrice: '',
    category:      '',
    brand:         '',
    stock:         '',
    isFeatured:    false,
  });

  const [images, setImages]         = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await productAPI.getById(id);
          const p = data.product;
          setFormData({
            name:          p.name,
            description:   p.description,
            price:         p.price,
            discountPrice: p.discountPrice || '',
            category:      p.category,
            brand:         p.brand || '',
            stock:         p.stock,
            isFeatured:    p.isFeatured || false,
          });
          setExistingImages(p.images);
        } catch (err) {
          toast.error('Failed to load product');
          navigate('/admin/products');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      images.forEach((img) => data.append('images', img));

      if (isEdit) {
        await productAPI.update(id, data);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(data);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Spinner />;

  return (
    <div className="page-wrapper">
      <div className="container admin-form">
        <h1 className="page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h2>Product Information</h2>

            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                className="form-control"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price ($) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Price ($)</label>
                <input
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  placeholder="0 = no discount"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  name="brand"
                  className="form-control"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.75rem' }}>
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                <label htmlFor="isFeatured" className="form-label" style={{ margin: 0 }}>
                  Featured Product
                </label>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h2>Product Images</h2>

            {isEdit && existingImages.length > 0 && (
              <div>
                <p className="form-label">Current Images</p>
                <div className="image-preview-grid">
                  {existingImages.map((img, idx) => (
                    <img key={idx} src={img.url} alt={`Product ${idx + 1}`} className="image-preview" />
                  ))}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Upload new images below to replace existing ones.
                </p>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">
                {isEdit ? 'Replace Images (optional)' : 'Upload Images *'}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-control"
                required={!isEdit}
              />
            </div>

            {previews.length > 0 && (
              <div className="image-preview-grid">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="image-preview" />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
