import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';
import { useNavigate } from 'react-router-dom';


function AdminViewProducts() {
    const [adminProducts, setAdminProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        product: null,
        isLoading: false,
        error: null
    });

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('admin/login');
                }

                const response = await axios.get('http://127.0.0.1:8080/api/admins/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setApiResponse(response.data);

                let productsData;

                if (Array.isArray(response.data)) {
                    productsData = response.data;
                } else if (typeof response.data === 'object') {
                    if (response.data.products) {
                        productsData = response.data.products;
                    } else if (response.data.data) {
                        productsData = response.data.data;
                    } else if (response.data.results) {
                        productsData = response.data.results;
                    } else {
                        productsData = [];
                    }
                } else {
                    productsData = [];
                }

                setAdminProducts(Array.isArray(productsData) ? productsData : []);
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

        fetchAllProducts();
    }, []);

    const handleDeleteProduct = (product) => {
        setDeleteModal({
            show: true,
            product: product,
            isLoading: false,
            error: null
        });
    };

    const confirmDeleteProduct = async () => {
        try {
            setDeleteModal(prev => ({ ...prev, isLoading: true, error: null }));

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(`http://127.0.0.1:8080/api/admins/products/${deleteModal.product.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setAdminProducts(prevProducts =>
                prevProducts.filter(c => c.id !== deleteModal.product.id)
            );

            // Close modal
            setDeleteModal({
                show: false,
                product: null,
                isLoading: false,
                error: null
            });

        } catch (error) {
            console.error('Delete error:', error);

            let errorMessage = 'Failed to delete product';
            if (error.response) {
                errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`;
            } else if (error.request) {
                errorMessage = 'No response received from server. Check your network connection.';
            } else {
                errorMessage = error.message;
            }

            setDeleteModal(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));
        }
    };

    const cancelDeleteProduct = () => {
        setDeleteModal({
            show: false,
            product: null,
            isLoading: false,
            error: null
        });
    };

    const DeleteConfirmationModal = () => {
        if (!deleteModal.show) return null;

        return (
            <div className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Delete Product
                            </h5>
                            <button type="button"
                                className="btn-close btn-close-white"
                                onClick={cancelDeleteProduct}
                                disabled={deleteModal.isLoading}>
                            </button>
                        </div>
                        <div className="modal-body p-4">
                            {deleteModal.error && (
                                <div className="alert alert-danger mb-3">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {deleteModal.error}
                                </div>
                            )}
                            <p className="mb-1">Are you sure you want to delete this product?</p>
                            <p className="fw-bold mb-3">{deleteModal.product?.title}</p>
                            <div className="alert alert-warning mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                This action cannot be undone. All product's related data will be permanently removed.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary"
                                onClick={cancelDeleteProduct}
                                disabled={deleteModal.isLoading}>
                                Cancel
                            </button>
                            <button type="button"
                                className="btn btn-danger"
                                onClick={confirmDeleteProduct}
                                disabled={deleteModal.isLoading}>
                                {deleteModal.isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-trash me-2"></i>
                                        Delete Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
                                            <h1 className="m-0 fs-3 fw-bold text-white">All Products</h1>
                                            <p className="m-0 text-white-50">
                                                {adminProducts.length} {adminProducts.length === 1 ? 'product' : 'products'} total
                                            </p>
                                        </div>
                                    </div>
                                    <a href="/admin/products/new" className="btn btn-light btn-sm">
                                        <i id="create-icon" className="fas fa-plus me-1"></i> New Product
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {adminProducts.length === 0 && !error ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                            <h4 className="mb-3">No Products Found</h4>
                            <p className="text-muted mb-4">There is no products yet.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 className="fw-bold mb-1">Error Loading Products</h5>
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
                                            <th scope="col" className="ps-4" style={{ width: '160px' }}>Product Image</th>
                                            <th scope="col">Name</th>
                                            <th scope="col" className="text-center">Description</th>
                                            <th scope="col" className="text-center">Category</th>
                                            <th scope="col" className="text-center">Price</th>
                                            <th scope="col" className="text-center" style={{ width: '120px' }}>Added At</th>
                                            <th scope="col" className="text-center" style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminProducts.map((product) => (
                                            <tr key={product.id} className="hover-shadow">
                                                <td className="ps-4">
                                                    {product.profile_image ? (
                                                        <img
                                                            src={product.profile_image}
                                                            alt={product.title}
                                                            className="img-fluid rounded shadow-sm"
                                                            style={{
                                                                height: '60px',
                                                                width: '100px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center shadow-sm"
                                                            style={{ height: '60px', width: '100px' }}>
                                                            <i className="fas fa-image text-muted"></i>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <h6 className="mb-1 fw-semibold">{product.name}</h6>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {product.description}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {product.category.name}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {product.price || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {product.created_at ?
                                                        new Date(product.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }) :
                                                        'N/A'}
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <a
                                                            href={`/admin/products/view/${product.id}`}
                                                            className="btn btn-sm btn-success"
                                                            title="View product"
                                                            // target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>
                                                        <a
                                                            href={`/admin/products/edit/${product.id}`}
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit product"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </a>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteProduct(product)}
                                                            title="Delete product"
                                                        >
                                                            <i className="fas fa-trash"></i>
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

                <DeleteConfirmationModal />
            </div>
        </>
    );
}

export default AdminViewProducts;