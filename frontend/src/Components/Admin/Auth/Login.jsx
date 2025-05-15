import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loginAdmin = async (credentials) => {
            try {
                const response = await axios.post('http://127.0.0.1:8080/api/admins/login', credentials, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Store token in localStorage
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/admin/products');
                }

                return response.data;
            } catch (error) {
                setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
                console.error('Login error:', error);
            } finally {
                setLoading(false);
            }
        };

        // This effect will run when form is submitted
        if (loading) {
            loginAdmin(formData);
        }
    }, [formData, loading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-danger"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;