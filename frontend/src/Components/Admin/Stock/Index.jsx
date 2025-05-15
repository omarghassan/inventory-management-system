import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';
import { useNavigate } from 'react-router-dom';

function AdminViewStock() {
    const [adminStock, setAdminStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [stockAction, setStockAction] = useState({
        show: false,
        stockId: null,
        productId: null,
        actionType: 'restock',
        quantity: '',
        notes: ''
    });
    const [actionMessage, setActionMessage] = useState({
        type: null, 
        text: null
    });

    const navigate = useNavigate();

    const handleActionClick = (stockId, actionType) => {
        // Find the current stock item
        const currentStock = adminStock.find(stock => stock.id === stockId);
        if (!currentStock) return;

        setStockAction({
            show: true,
            stockId: stockId,
            productId: currentStock.product.id,
            actionType: actionType || 'restock',
            quantity: '',
            notes: ''
        });
    };

    const handleActionInputChange = (e) => {
        const { name, value } = e.target;
        setStockAction(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setActionMessage({ type: null, text: null });

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            // Find the full stock item to get updated information
            const currentStock = adminStock.find(stock => stock.id === stockAction.stockId);
            if (!currentStock) {
                throw new Error('Stock item not found');
            }

            const productId = currentStock.product.id;
            let endpoint = '';
            let payload = {};

            // Make sure we're using integers for the quantity
            const quantityValue = parseInt(stockAction.quantity, 10);
            if (isNaN(quantityValue) || quantityValue <= 0) {
                setActionMessage({
                    type: 'danger',
                    text: 'Please enter a valid quantity (greater than 0)'
                });
                setActionLoading(false);
                return;
            }

            switch (stockAction.actionType) {
                case 'restock':
                    endpoint = `http://127.0.0.1:8080/api/admins/products/${productId}/stock/add`;
                    payload = { quantity: quantityValue };
                    break;
                case 'reduce':
                    endpoint = `http://127.0.0.1:8080/api/admins/products/${productId}/stock/reduce`;
                    payload = { quantity: quantityValue };
                    break;
                case 'adjust':
                    endpoint = `http://127.0.0.1:8080/api/admins/products/${productId}/stock/adjust`;
                    payload = { 
                        quantity: quantityValue,
                        notes: stockAction.notes || '' 
                    };
                    break;
                default:
                    throw new Error('Invalid action type');
            }

            console.log('Sending request to:', endpoint);
            console.log('With payload:', payload);

            const response = await axios({
                method: 'POST',
                url: endpoint,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Response:', response);

            // Update the stock in the UI
            const updatedStocks = adminStock.map(stock => {
                if (stock.id === stockAction.stockId) {
                    // Handle different response structures
                    const newQuantity = response.data?.data?.quantity || 
                                       response.data?.quantity || 
                                       (stockAction.actionType === 'restock' 
                                           ? stock.quantity + quantityValue
                                           : stockAction.actionType === 'reduce'
                                               ? Math.max(0, stock.quantity - quantityValue)
                                               : quantityValue);
                    
                    return {
                        ...stock,
                        quantity: newQuantity
                    };
                }
                return stock;
            });
            
            setAdminStock(updatedStocks);
            setActionMessage({ 
                type: 'success', 
                text: `Stock ${stockAction.actionType === 'restock' ? 'restocked' : 
                       stockAction.actionType === 'reduce' ? 'reduced' : 'adjusted'} successfully!` 
            });
            
            // Close the modal after a delay
            setTimeout(() => {
                setStockAction(prev => ({ ...prev, show: false }));
                setActionMessage({ type: null, text: null });
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            // More detailed error handling
            let errorMessage = 'An error occurred while processing your request.';
            
            if (error.response) {
                console.log('Error response:', error.response);
                errorMessage = error.response.data?.message || 
                              error.response.data?.error || 
                              `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response received from server. Please check your network connection.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setActionMessage({ 
                type: 'danger', 
                text: errorMessage
            });
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        const fetchAllStocks = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                console.log('Fetching stocks...');
                const response = await axios({
                    method: 'GET',
                    url: 'http://127.0.0.1:8080/api/admins/stocks',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                console.log('Stocks response:', response);

                if (response.data && response.data.data) {
                    setAdminStock(response.data.data);
                } else {
                    setAdminStock([]);
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);

                if (error.response) {
                    console.log('Error response:', error.response);
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

        fetchAllStocks();
    }, [navigate]);

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
                                    <div>
                                        <h1 className="m-0 fs-3 fw-bold text-white">All Stock</h1>
                                        <p className="m-0 text-white-50">
                                            {adminStock.length} {adminStock.length === 1 ? 'stock' : 'stocks'} total
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {adminStock.length === 0 && !error ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                            <h4 className="mb-3">No Stock Found</h4>
                            <p className="text-muted mb-4">There is no stock yet.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 className="fw-bold mb-1">Error Loading Stocks</h5>
                                <p className="mb-0">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th scope="col" className="ps-4">Product Name</th>
                                            <th scope="col" className="text-center">SKU</th>
                                            <th scope="col" className="text-center">Price</th>
                                            <th scope="col" className="text-center">Quantity</th>
                                            <th scope="col" className="text-center" style={{ width: '120px' }}>Added At</th>
                                            <th scope="col" className="text-center" style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminStock.map((stock) => (
                                            <tr key={stock.id} className="hover-shadow">
                                                <td className="ps-4">
                                                    <h6 className="mb-1 fw-semibold">{stock.product.name}</h6>
                                                </td>
                                                <td className="text-center">
                                                    <span>{stock.product.sku}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span>${parseFloat(stock.product.price).toFixed(2)}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={stock.quantity <= 0 ? "text-danger fw-bold" : ""}>
                                                        {stock.quantity}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {stock.created_at ?
                                                        new Date(stock.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }) :
                                                        'N/A'}
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            title="Manage stock"
                                                            onClick={() => handleActionClick(stock.id, 'restock')}
                                                        >
                                                            <i className="fas fa-cubes"></i> Manage Stock
                                                        </button>
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

                {/* Stock Action Modal */}
                {stockAction.show && (
                    <div className="position-fixed top-0 start-0 w-100 h-100" 
                         style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                         onClick={() => setStockAction(prev => ({ ...prev, show: false }))}>
                        <div className="position-absolute" 
                             style={{ 
                                top: '50%', 
                                left: '50%', 
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1051 
                             }}
                             onClick={e => e.stopPropagation()}>
                            <div className="card" style={{ minWidth: '300px', maxWidth: '400px' }}>
                                <div className="card-header bg-danger bg-gradient text-white">
                                    <h5 className="card-title mb-0">
                                        {stockAction.actionType === 'restock' ? 'Restock Inventory' : 
                                         stockAction.actionType === 'reduce' ? 'Reduce Inventory' : 'Adjust Inventory'}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {actionMessage.text && (
                                        <div className={`alert alert-${actionMessage.type} py-2 mb-3`} role="alert">
                                            {actionMessage.text}
                                        </div>
                                    )}
                                    
                                    <form onSubmit={handleActionSubmit}>
                                        <div className="mb-3">
                                            <div className="btn-group w-100 mb-3">
                                                <button 
                                                    type="button" 
                                                    className={`btn ${stockAction.actionType === 'restock' ? 'btn-danger' : 'btn-outline-danger'}`}
                                                    onClick={() => setStockAction(prev => ({ ...prev, actionType: 'restock' }))}
                                                >
                                                    <i className="fas fa-plus-circle me-1"></i> Restock
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`btn ${stockAction.actionType === 'reduce' ? 'btn-danger' : 'btn-outline-danger'}`}
                                                    onClick={() => setStockAction(prev => ({ ...prev, actionType: 'reduce' }))}
                                                >
                                                    <i className="fas fa-minus-circle me-1"></i> Reduce
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className={`btn ${stockAction.actionType === 'adjust' ? 'btn-danger' : 'btn-outline-danger'}`}
                                                    onClick={() => setStockAction(prev => ({ ...prev, actionType: 'adjust' }))}
                                                >
                                                    <i className="fas fa-sync-alt me-1"></i> Adjust
                                                </button>
                                            </div>
                                            
                                            <label htmlFor="quantity" className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="quantity"
                                                name="quantity"
                                                value={stockAction.quantity}
                                                onChange={handleActionInputChange}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        
                                        {stockAction.actionType === 'adjust' && (
                                            <div className="mb-3">
                                                <label htmlFor="notes" className="form-label">Notes</label>
                                                <textarea
                                                    className="form-control"
                                                    id="notes"
                                                    name="notes"
                                                    value={stockAction.notes}
                                                    onChange={handleActionInputChange}
                                                    rows="2"
                                                    placeholder="Reason for adjustment"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="d-grid">
                                            <button 
                                                type="submit" 
                                                className="btn btn-danger"
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Submit'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminViewStock;