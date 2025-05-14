import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../Layouts/Admins/AdminSidebar';

function AdminProfile() {
    const navigate = useNavigate();

    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8080/api/admins/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setAdmin(response.data);
            } catch (err) {
                console.error('Error fetching admin profile:', err);
                setError('Failed to load admin profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

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
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
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
                                <h1 className="m-0 fs-3 fw-bold text-white">Admin Profile</h1>
                                <p className="m-0 text-white-50">View and manage your account details</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <div className="row align-items-center mb-4">
                            <div className="col-md-2 text-center">
                                {admin.profile_image ? (
                                    <img
                                        src={admin.profile_image}
                                        alt="Profile"
                                        className="rounded-circle img-fluid"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white"
                                        style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                                    >
                                        {admin.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-10">
                                <h3>{admin.name}</h3>
                                <p className="text-muted mb-1">
                                    <strong>Email:</strong> {admin.email}
                                </p>
                                <p className="text-muted mb-1">
                                    <strong>Phone:</strong> {admin.phone || 'Not provided'}
                                </p>
                                <p className="text-muted mb-0">
                                    <strong>Joined:</strong> {new Date(admin.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-md-6">
                                <h5>Account Info</h5>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>ID</strong>
                                        <span>{admin.id}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Status</strong>
                                        <span className="badge bg-success">Active</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Last Updated</strong>
                                        <span>{new Date(admin.updated_at).toLocaleString()}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                className="btn btn-success me-2"
                                onClick={() => navigate('/admin/profile/edit')}
                            >
                                <i className="fas fa-edit me-1"></i>Edit Profile
                            </button>
                            <button className="btn btn-outline-secondary">
                                <i className="fas fa-lock me-1"></i>Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminProfile;