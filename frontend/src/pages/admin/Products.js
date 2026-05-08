import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { adminAPI, productAPI } from '../../utils/api';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', originalPrice: '', category: 'Electronics', brand: '', stock: '', images: [''], isFeatured: false, discount: 0 };
const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Beauty', 'Toys', 'Automotive'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    productAPI.getAll({ limit: 100 }).then(({ data }) => setProducts(data.products)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p, images: p.images?.length ? p.images : [''] }); setEditId(p._id); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock), images: form.images.filter(Boolean) };
      if (editId) await adminAPI.updateProduct(editId, payload);
      else await adminAPI.createProduct(payload);
      toast.success(editId ? 'Product updated' : 'Product created');
      setShowModal(false);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await adminAPI.deleteProduct(id); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Products ({products.length})</h1>
        <button className="btn btn-primary" onClick={openAdd} data-cy="add-product-btn"><FiPlus /> Add Product</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} data-cy="product-row">
                  <td><img src={p.images?.[0]} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /></td>
                  <td style={{ fontWeight: 600, maxWidth: 200 }}>{p.name}</td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{p.price?.toLocaleString()}</td>
                  <td><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} data-cy="edit-product-btn"><FiEdit2 /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} data-cy="delete-product-btn"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700 }}>{editId ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--text-muted)' }}><FiX /></button>
            </div>
            <form onSubmit={handleSave} data-cy="product-form">
              {[['name', 'Product Name', 'text'], ['brand', 'Brand', 'text'], ['price', 'Price (₹)', 'number'], ['originalPrice', 'Original Price (₹)', 'number'], ['stock', 'Stock', 'number'], ['discount', 'Discount (%)', 'number']].map(([key, label, type]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={['name', 'price', 'stock'].includes(key)} data-cy={`${key}-input`} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-cy="category-select">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required data-cy="description-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" className="form-input" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} data-cy="image-input" />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                  Featured Product
                </label>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving} data-cy="save-product-btn">
                  <FiCheck /> {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
