import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AdminNav } from '../../components/admin/AdminNav';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const AdminProductsPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // Delete modal state
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products?limit=100${keyword ? `&keyword=${keyword}` : ''}`),
        api.get('/categories'),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setCategoryId(categories[0]?._id || '');
    setPrice('');
    setDiscountPrice('');
    setCountInStock('10');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80');
    setIsFeatured(false);
    setIsTrending(false);
    setIsBestSeller(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategoryId(p.category?._id || p.category || categories[0]?._id);
    setPrice(p.price.toString());
    setDiscountPrice(p.discountPrice ? p.discountPrice.toString() : '');
    setCountInStock(p.countInStock.toString());
    setDescription(p.description);
    setImageUrl(p.images?.[0] || '');
    setIsFeatured(!!p.isFeatured);
    setIsTrending(!!p.isTrending);
    setIsBestSeller(!!p.isBestSeller);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setImageUrl(res.data.imageUrl);
        showToast('Image uploaded successfully', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      return showToast('Please fill in required product fields', 'warning');
    }

    setSaving(true);
    try {
      const payload = {
        name,
        brand,
        category: categoryId,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : Number(price),
        countInStock: Number(countInStock),
        description,
        images: [imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
        isFeatured,
        isTrending,
        isBestSeller,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await api.post('/products', payload);
        showToast('Product created successfully', 'success');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteModalProduct) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteModalProduct._id}`);
      showToast('Product removed', 'info');
      setDeleteModalProduct(null);
      fetchProducts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      <AdminNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total {products.length} products listed in database
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products by title, brand, or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl bg-slate-50 object-contain p-1 border border-slate-100 flex-shrink-0"
                        />
                        <div className="max-w-xs truncate">
                          <p className="font-bold text-slate-900 truncate">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.isFeatured && <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                            {p.isTrending && <span className="text-[10px] text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded font-bold">Trending</span>}
                            {p.isBestSeller && <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded font-bold">Best Seller</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{p.brand}</td>
                    <td className="py-3 px-4 text-slate-600">{p.category?.name || 'General'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        p.countInStock <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {p.countInStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalProduct(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 my-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AeroSound Pro Wireless Headphones"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. AeroSound"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="199.99"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Original / Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="249.99"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Product Image</label>
                  <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-brand-500 cursor-pointer text-xs text-slate-600 bg-slate-50/50">
                    <Upload className="w-3.5 h-3.5 text-brand-600" />
                    <span>{uploadingImage ? 'Uploading...' : 'Choose File (Multer / Cloudinary)'}</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL Preview</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed product highlights and features..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-brand-600 outline-none"
                  />
                </div>

                {/* Flags */}
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Featured on Home
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Trending Badge
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Best Seller Badge
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently remove "{deleteModalProduct.name}"?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteModalProduct(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
