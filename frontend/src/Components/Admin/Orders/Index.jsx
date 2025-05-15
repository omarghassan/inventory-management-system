import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';
import { useNavigate } from 'react-router-dom';


function AdminViewOrders() {
    const [adminOrders, setAdminOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('admin/login');
                }

                const response = await axios.get('http://127.0.0.1:8080/api/admins/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setApiResponse(response.data);

                let ordersData;

                if (Array.isArray(response.data)) {
                    ordersData = response.data;
                } else if (typeof response.data === 'object') {
                    if (response.data.orders) {
                        ordersData = response.data.orders;
                    } else if (response.data.data) {
                        ordersData = response.data.data;
                    } else if (response.data.results) {
                        ordersData = response.data.results;
                    } else {
                        ordersData = [];
                    }
                } else {
                    ordersData = [];
                }

                setAdminOrders(Array.isArray(ordersData) ? ordersData : []);
            } catch (error) {
                console.error('Error:', error);

                if (error.response) {
                    setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
                } else if (error.request) {
                    setError('No response received from server. Check your network connection.');
                } else {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, []);

    if (loading) {
        return (
            <>
                <AdminSidebar />
                <div className="container-fluid py-4" style={{ marginLeft: '260px' }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminSidebar />
            <div id="main-container" className="container-fluid py-4" style={{ marginLeft: '260px', maxWidth: 'calc(100% - 280px)' }}>
                <div className="row mb-4">
                    <div className="col">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="bg-danger bg-gradient p-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <h1 className="m-0 fs-3 fw-bold text-white">All Orders</h1>
                                            <p className="m-0 text-white-50">
                                                {adminOrders.length} {adminOrders.length === 1 ? 'order' : 'orders'} total
                                            </p>
                                        </div>
                                    </div>
                                    <a href="/admin/orders/new" className="btn btn-light btn-sm">
                                        <i id="create-icon" className="fas fa-plus me-1"></i> New Order
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {adminOrders.length === 0 && !error ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                            <h4 className="mb-3">No Orders Found</h4>
                            <p className="text-muted mb-4">There is no orders yet.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 className="fw-bold mb-1">Error Loading Orders</h5>
                                <p className="mb-0">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div id='table' className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th scope="col" className="text-center">Order Number</th>
                                            <th scope="col" className="text-center">Total Amount</th>
                                            <th scope="col" className="text-center">Order Status</th>
                                            <th scope="col" className="text-center" style={{ width: '120px' }}>Added At</th>
                                            <th scope="col" className="text-center" style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminOrders.map((order) => (
                                            <tr key={order.id} className="hover-shadow">
                                                <td className="text-center">
                                                    <h6 className="text-center">#{order.id}</h6>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {order.total_amount || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {order.status || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {order.created_at ?
                                                        new Date(order.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }) :
                                                        'N/A'}
                                                </td>
                                                <td className="text-center pe-4">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <a
                                                            href={`/admin/orders/view/${order.id}`}
                                                            className="btn btn-sm btn-success"
                                                            title="View Order"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>
                                                        <a
                                                            href={`/admin/orders/edit/${order.id}`}
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit Order"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

export default AdminViewOrders;