import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

const AdminProductsDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('admin/login');
                }

                const response = await axios.get(`http://127.0.0.1:8080/api/admins/products/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setProduct(response.data || {});
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    if (!product || !product.id) {
        return (
            <div className="alert alert-warning" role="alert">
                Product not found.
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
                                <div className="d-flex align-items-center justify-content-between w-100 flex-wrap">
                                    <div className="d-flex align-items-center mb-3 mb-md-0">
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">Product Details</h1>
                                            <p className="m-0 text-white-50">Viewing: <strong>{product.name}</strong></p>
                                        </div>
                                    </div>
                                    <a href="/admin/products" className="btn btn-light btn-sm">
                                        <i id="create-icon" className="fas fa-arrow-left me-1"></i> Go Back
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="row g-4">
                            {/* Profile Image */}
                            <div className="col-md-4 text-center">
                                {product.profile_image ? (
                                    <img
                                        src={product.profile_image}
                                        alt={product.name}
                                        className="img-fluid rounded-circle shadow"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow"
                                        style={{ width: '150px', height: '150px' }}>
                                        <i className="fas fa-user-circle text-muted" style={{ fontSize: '5rem' }}></i>
                                    </div>
                                )}
                                <h5 className="mt-3 mb-0">{product.name}</h5>
                                <small className="text-muted">{product.category.name}</small>
                            </div>

                            <div className="col-md-8">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th>Name:</th>
                                            <td>{product.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Category:</th>
                                            <td>{product.category.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Description:</th>
                                            <td>{product.description || 'Not provided'}</td>
                                        </tr>
                                        <tr>
                                            <th>SKU:</th>
                                            <td>{product.SKU || 'No bio available'}</td>
                                        </tr>
                                        <tr>
                                            <th>Price:</th>
                                            <td>{product.price || 'No bio available'}</td>
                                        </tr>
                                        <tr>
                                            <th>Registered At:</th>
                                            <td>
                                                {new Date(product.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Last Updated:</th>
                                            <td>
                                                {new Date(product.updated_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Status:</th>
                                            <td>
                                                {product.active ? (
                                                    <span className="badge bg-success">Active</span>
                                                ) : (
                                                    <span className="badge bg-danger">Not Available</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminProductsDetails;