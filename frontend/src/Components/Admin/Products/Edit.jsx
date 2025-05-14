import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

function AdminEditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        SKU: '',
        category_id: '',
        quantity: '',
        active: true
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [categoryLoading, setCategoryLoading] = useState(true);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const res = await axios.get(`http://127.0.0.1:8080/api/admins/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Check the structure of the response and extract the categories array properly
                const categoriesData = Array.isArray(res.data) ? res.data : 
                                      (res.data.categories || res.data.data || []);
                
                console.log('Categories data:', categoriesData);
                
                // Initialize as empty array if data is still not an array
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories.');
                setCategories([]); // Set empty array on error
            } finally {
                setCategoryLoading(false);
            }
        };

        fetchCategories();
    }, [navigate]);

    // Fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const res = await axios.get(`http://127.0.0.1:8080/api/admins/products/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const product = res.data;

                setFormData({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    SKU: product.SKU || '',
                    category_id: product.category_id || '',
                    quantity: product.quantity || '',
                    active: product.active || true
                });
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            await axios.put(`http://127.0.0.1:8080/api/admins/products/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            navigate(`/admin/products/view/${id}`);
        } catch (err) {
            console.error('Update error:', err);
            let message = 'Failed to update product.';
            if (err.response?.data?.message) {
                message = err.response.data.message;
            }
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || categoryLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminSidebar />
            <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-danger bg-gradient p-4">
                                <h1 className="m-0 fs-3 fw-bold text-white">Edit Product</h1>
                                <p className="m-0 text-white-50">Update product information below</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="SKU" className="form-label">SKU</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="SKU"
                                    name="SKU"
                                    value={formData.SKU}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="category_id" className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {Array.isArray(categories) ? (
                                        categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No categories available</option>
                                    )}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="active"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="active">Active</label>
                            </div>

                            <div className="d-flex justify-content-between">
                                <a href="/admin/products" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-1"></i> Cancel
                                </a>
                                <button
                                    type="submit"
                                    className="btn btn-success px-4"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-1"></i> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminEditProduct;