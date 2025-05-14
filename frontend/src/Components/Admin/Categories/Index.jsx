import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../Layouts/Admins/AdminSidebar';
import { useNavigate } from 'react-router-dom';


function AdminViewCategories() {
    const [adminCategories, setAdminCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        category: null,
        isLoading: false,
        error: null
    });

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('admin/login');
                }

                const response = await axios.get('http://127.0.0.1:8080/api/admins/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setApiResponse(response.data);

                let categoriesData;

                if (Array.isArray(response.data)) {
                    categoriesData = response.data;
                } else if (typeof response.data === 'object') {
                    if (response.data.categories) {
                        categoriesData = response.data.categories;
                    } else if (response.data.data) {
                        categoriesData = response.data.data;
                    } else if (response.data.results) {
                        categoriesData = response.data.results;
                    } else {
                        categoriesData = [];
                    }
                } else {
                    categoriesData = [];
                }

                setAdminCategories(Array.isArray(categoriesData) ? categoriesData : []);
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

        fetchAllCategories();
    }, []);

    const handleDeleteCategory = (category) => {
        setDeleteModal({
            show: true,
            category: category,
            isLoading: false,
            error: null
        });
    };

    const confirmDeleteCategory = async () => {
        try {
            setDeleteModal(prev => ({ ...prev, isLoading: true, error: null }));

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(`http://127.0.0.1:8080/api/admins/categories/${deleteModal.category.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setAdminCategories(prevCategories =>
                prevCategories.filter(c => c.id !== deleteModal.category.id)
            );

            // Close modal
            setDeleteModal({
                show: false,
                category: null,
                isLoading: false,
                error: null
            });

        } catch (error) {
            console.error('Delete error:', error);

            let errorMessage = 'Failed to delete category';
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

    const cancelDeleteCategory = () => {
        setDeleteModal({
            show: false,
            category: null,
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
                                Delete Category
                            </h5>
                            <button type="button"
                                className="btn-close btn-close-white"
                                onClick={cancelDeleteCategory}
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
                            <p className="mb-1">Are you sure you want to delete this category?</p>
                            <p className="fw-bold mb-3">{deleteModal.category?.title}</p>
                            <div className="alert alert-warning mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                This action cannot be undone. All category's related data will be permanently removed.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-secondary"
                                onClick={cancelDeleteCategory}
                                disabled={deleteModal.isLoading}>
                                Cancel
                            </button>
                            <button type="button"
                                className="btn btn-danger"
                                onClick={confirmDeleteCategory}
                                disabled={deleteModal.isLoading}>
                                {deleteModal.isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-trash me-2"></i>
                                        Delete Category
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
                                            <h1 className="m-0 fs-3 fw-bold text-white">All Categories</h1>
                                            <p className="m-0 text-white-50">
                                                {adminCategories.length} {adminCategories.length === 1 ? 'category' : 'categories'} total
                                            </p>
                                        </div>
                                    </div>
                                    <a href="/admin/categories/new" className="btn btn-light btn-sm">
                                        <i id="create-icon" className="fas fa-plus me-1"></i> New Category
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {adminCategories.length === 0 && !error ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-book-open fs-1 text-muted mb-3"></i>
                            <h4 className="mb-3">No Categories Found</h4>
                            <p className="text-muted mb-4">There is no products yet.</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <div>
                                <h5 className="fw-bold mb-1">Error Loading Categories</h5>
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
                                            <th scope="col" className="text-center">Name</th>
                                            <th scope="col" className="text-center">Description</th>
                                            <th scope="col" className="text-center">Products Count</th>
                                            <th scope="col" className="text-center" style={{ width: '120px' }}>Added At</th>
                                            <th scope="col" className="text-center" style={{ width: '180px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adminCategories.map((category) => (
                                            <tr key={category.id} className="hover-shadow">
                                                <td className="text-center">
                                                    <h6 className="text-center">{category.name}</h6>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {category.description || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span>
                                                        {category.products_count || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                                                    {category.created_at ?
                                                        new Date(category.created_at).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        }) :
                                                        'N/A'}
                                                </td>
                                                <td className="text-center pe-4">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <a
                                                            href={`/admin/categories/edit/${category.id}`}
                                                            className="btn btn-sm btn-warning"
                                                            title="Edit category"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </a>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDeleteCategory(category)}
                                                            title="Delete category"
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

export default AdminViewCategories;