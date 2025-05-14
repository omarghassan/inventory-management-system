import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

function AdminAddCategory() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

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
            if (!token) {
                navigate('/admin/login');
                return;
            }

            const res = await axios.post(
                'http://127.0.0.1:8080/api/admins/categories',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate(`/admin/categories/`);
        } catch (err) {
            console.error('Error adding category:', err);
            let message = 'Failed to add new category.';
            if (err.response?.data?.message) {
                message = err.response.data.message;
            }
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <AdminSidebar />
            <div className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-danger bg-gradient p-4">
                                <h1 className="m-0 fs-3 fw-bold text-white">Add New Category</h1>
                                <p className="m-0 text-white-50">Fill in the details below</p>
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
                                <label htmlFor="name" className="form-label">Category Name</label>
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

                            <div className="d-flex justify-content-between">
                                <a href="/admin/categories" className="btn btn-outline-secondary">
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
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus me-1"></i> Add Category
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

export default AdminAddCategory;