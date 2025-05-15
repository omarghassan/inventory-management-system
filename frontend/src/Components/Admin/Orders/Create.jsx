import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';

const AdminPlaceOrder = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        user_id: '', // Will be manually entered now
        items: [{ product_id: '', quantity: 1 }],
        notes: '',
        status: 'pending'
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                };
                
                const productsResponse = await axios.get('http://127.0.0.1:8080/api/admins/products', { headers });
                
                setProducts(productsResponse.data.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load required data for order placement.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: field === 'quantity' ? parseInt(value, 10) || 1 : value
        };
        
        setFormData(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { product_id: '', quantity: 1 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) {
            return;
        }

        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        if (!formData.user_id) {
            setError('Please enter a customer ID');
            setSubmitting(false);
            return;
        }

        const invalidItems = formData.items.filter(item => !item.product_id);
        if (invalidItems.length > 0) {
            setError('Please select products for all items');
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            const response = await axios.post(
                'http://127.0.0.1:8080/api/admins/orders',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess('Order placed successfully!');
            
            setTimeout(() => {
                navigate(`/admin/orders/`);
            }, 2000);
        } catch (err) {
            console.error('Error placing order:', err);
            setError(`Failed to place order: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
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
                                <div className="d-flex align-items-center justify-content-between w-100 flex-wrap">
                                    <div className="d-flex align-items-center mb-3 mb-md-0">
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">Place New Order</h1>
                                            <p className="m-0 text-white-50">Create a new order for a customer</p>
                                        </div>
                                    </div>
                                    <a href="/admin/orders" className="btn btn-light btn-sm">
                                        <i className="fas fa-arrow-left me-1"></i> Back to Orders
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success" role="alert">
                        {success}
                    </div>
                )}

                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Customer ID Input Field */}
                            <div className="mb-4">
                                <label htmlFor="user_id" className="form-label fw-bold">Customer ID</label>
                                <input
                                    type="text"
                                    id="user_id"
                                    name="user_id"
                                    className="form-control"
                                    value={formData.user_id}
                                    onChange={handleInputChange}
                                    placeholder="Enter customer ID"
                                    required
                                />
                                <small className="text-muted">Enter the numeric ID of the customer</small>
                            </div>

                            {/* Order Status */}
                            <div className="mb-4">
                                <label htmlFor="status" className="form-label fw-bold">Order Status</label>
                                <select 
                                    id="status"
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="on hold">On Hold</option>
                                </select>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Order Items</label>
                                {formData.items.map((item, index) => (
                                    <div key={index} className="card mb-3">
                                        <div className="card-body">
                                            <div className="row g-3 align-items-center">
                                                <div className="col-md-6">
                                                    <label htmlFor={`product_${index}`} className="form-label">Product</label>
                                                    <select
                                                        id={`product_${index}`}
                                                        className="form-select"
                                                        value={item.product_id}
                                                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select a product</option>
                                                        {products.map(product => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.name} - ${parseFloat(product.price).toFixed(2)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <label htmlFor={`quantity_${index}`} className="form-label">Quantity</label>
                                                    <input
                                                        type="number"
                                                        id={`quantity_${index}`}
                                                        className="form-control"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2 d-flex align-items-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger w-100"
                                                        onClick={() => removeItem(index)}
                                                        disabled={formData.items.length === 1}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={addItem}
                                >
                                    <i className="fas fa-plus me-1"></i> Add Another Product
                                </button>
                            </div>

                            {/* Order Notes */}
                            <div className="mb-4">
                                <label htmlFor="notes" className="form-label fw-bold">Order Notes</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    className="form-control"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Add any notes about this order"
                                ></textarea>
                            </div>

                            {/* Order Summary */}
                            <div className="card bg-light mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Order Summary</h5>
                                    <div className="table-responsive">
                                        <table className="table table-borderless mb-0">
                                            <tbody>
                                                {formData.items.map((item, index) => {
                                                    const selectedProduct = products.find(p => p.id === parseInt(item.product_id));
                                                    const price = selectedProduct ? parseFloat(selectedProduct.price) : 0;
                                                    const subtotal = price * item.quantity;
                                                    
                                                    return selectedProduct ? (
                                                        <tr key={index}>
                                                            <td>{selectedProduct.name}</td>
                                                            <td>{item.quantity} × ${price.toFixed(2)}</td>
                                                            <td className="text-end">${subtotal.toFixed(2)}</td>
                                                        </tr>
                                                    ) : null;
                                                })}
                                            </tbody>
                                            <tfoot className="border-top">
                                                <tr>
                                                    <th colSpan="2" className="text-end">Total:</th>
                                                    <th className="text-end">
                                                        $
                                                        {formData.items.reduce((total, item) => {
                                                            const selectedProduct = products.find(p => p.id === parseInt(item.product_id));
                                                            const price = selectedProduct ? parseFloat(selectedProduct.price) : 0;
                                                            return total + (price * item.quantity);
                                                        }, 0).toFixed(2)}
                                                    </th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>Place Order</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminPlaceOrder;