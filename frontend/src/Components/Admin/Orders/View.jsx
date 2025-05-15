import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8080/api/admins/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Check if we actually have order data
                if (response.data && response.data.data && response.data.data.id) {
                    setOrder(response.data.data);
                } else {
                    setError('No order data returned from API.');
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError(`Failed to load order details: ${err.response?.data?.message || err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);  // Added navigate to dependency array

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

    if (!order || !order.id) {
        return (
            <div className="alert alert-warning" role="alert">
                Order not found. Please check the order ID or try again later.
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
                                            <h1 className="m-0 fs-3 fw-bold text-white">Order Details</h1>
                                            <p className="m-0 text-white-50">Viewing order no.: <strong>#{order.id}</strong></p>
                                        </div>
                                    </div>
                                    <a href="/admin/orders" className="btn btn-light btn-sm">
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
                            {/* Customer Information */}
                            <div className="col-md-4 text-center">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow mx-auto"
                                    style={{ width: '150px', height: '150px' }}>
                                    <i className="fas fa-user-circle text-muted" style={{ fontSize: '5rem' }}></i>
                                </div>
                                <h5 className="mt-3 mb-0">Customer ID: {order.user_id}</h5>
                                <small className="text-muted">Order #{order.id}</small>
                            </div>

                            {/* Order Information */}
                            <div className="col-md-8">
                                <h4 className="mb-3">Order Information</h4>
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th>Order ID:</th>
                                            <td>#{order.id}</td>
                                        </tr>
                                        <tr>
                                            <th>Order Date:</th>
                                            <td>
                                                {new Date(order.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Status:</th>
                                            <td>
                                                <span className={`badge bg-${getStatusColor(order.status)}`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Total Amount:</th>
                                            <td>${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <th>User ID:</th>
                                            <td>{order.user_id}</td>
                                        </tr>
                                        <tr>
                                            <th>Notes:</th>
                                            <td>{order.notes || 'No notes available'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="row mt-4">
                            <div className="col-12">
                                <h4 className="mb-3">Order Items</h4>
                                {order.items && order.items.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>SKU</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.product.name}</td>
                                                        <td>{item.product.sku || 'N/A'}</td>
                                                        <td>${parseFloat(item.unit_price || 0).toFixed(2)}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${(parseFloat(item.unit_price || 0) * item.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="4" className="text-end">Total:</th>
                                                    <th>${parseFloat(order.total_amount || 0).toFixed(2)}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info">No items found for this order.</div>
                                )}
                            </div>
                        </div>

                        {/* Order Details Section */}
                        <div className="row mt-4">
                            <div className="col-12">
                                <h4 className="mb-3">Notes</h4>
                                <div className="card">
                                    <div className="card-body">
                                        {order.notes ? (
                                            <p>{order.notes}</p>
                                        ) : (
                                            <p className="text-muted">No notes for this order.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Helper function to determine badge color based on order status
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return 'success';
        case 'processing':
            return 'primary';
        case 'shipped':
            return 'info';
        case 'cancelled':
            return 'danger';
        case 'on hold':
            return 'warning';
        case 'refunded':
            return 'secondary';
        default:
            return 'primary';
    }
};

export default AdminOrderDetails;