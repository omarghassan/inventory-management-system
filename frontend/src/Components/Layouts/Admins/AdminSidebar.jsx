import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/logo.png'
import './AdminSidebar.css'

function AdminSidebar() {

    const navigate = useNavigate()

    return (
        <div className="admin-sidebar-container">
            <aside className="admin-sidenav">
                <div className="admin-sidenav-header">
                    <Link to="/admin/home" className="admin-navbar-brand">
                        <img src={logo} className="admin-navbar-brand-img" width="30" height="30" alt="Releans Logo" />
                        <span>Releans</span>
                    </Link>
                </div>

                <div className="admin-navbar-collapse">
                    <ul className="admin-navbar-nav">
                        <li className="admin-nav-item">
                            <Link to="/admin/home" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link to="/admin/profile" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                </svg>
                                <span>Profile</span>
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link to="/admin/products" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24" >
                                    <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                                <span>Products</span>
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link to="/admin/categories" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill='currentColor' d="M8 4C8 5.10457 7.10457 6 6 6 4.89543 6 4 5.10457 4 4 4 2.89543 4.89543 2 6 2 7.10457 2 8 2.89543 8 4ZM5 16V22H3V10C3 8.34315 4.34315 7 6 7 6.82059 7 7.56423 7.32946 8.10585 7.86333L10.4803 10.1057 12.7931 7.79289 14.2073 9.20711 10.5201 12.8943 9 11.4587V22H7V16H5ZM10 5H19V14H10V16H14.3654L17.1889 22H19.3993L16.5758 16H20C20.5523 16 21 15.5523 21 15V4C21 3.44772 20.5523 3 20 3H10V5Z" />
                                </svg>
                                <span>Categories</span>
                            </Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link to="/admin/courses" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24" >
                                    <path fill="currentColor" d="M21 4H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H7v2h10v-2h-2v-2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H3V6h18v10zm-10-1 5-3-5-3v6z" />
                                </svg>
                                <span>Courses</span>
                            </Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link to="/admin/blogs" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                <span>Blogs</span>
                            </Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link to="/admin/subscriptions" className="admin-nav-link">
                                <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3.00488 3.00275H21.0049C21.5572 3.00275 22.0049 3.45046 22.0049 4.00275V20.0027C22.0049 20.555 21.5572 21.0027 21.0049 21.0027H3.00488C2.4526 21.0027 2.00488 20.555 2.00488 20.0027V4.00275C2.00488 3.45046 2.4526 3.00275 3.00488 3.00275ZM8.50488 14.0027V16.0027H11.0049V18.0027H13.0049V16.0027H14.0049C15.3856 16.0027 16.5049 14.8835 16.5049 13.5027C16.5049 12.122 15.3856 11.0027 14.0049 11.0027H10.0049C9.72874 11.0027 9.50488 10.7789 9.50488 10.5027C9.50488 10.2266 9.72874 10.0027 10.0049 10.0027H15.5049V8.00275H13.0049V6.00275H11.0049V8.00275H10.0049C8.62417 8.00275 7.50488 9.12203 7.50488 10.5027C7.50488 11.8835 8.62417 13.0027 10.0049 13.0027H14.0049C14.281 13.0027 14.5049 13.2266 14.5049 13.5027C14.5049 13.7789 14.281 14.0027 14.0049 14.0027H8.50488Z"></path>
                                </svg>
                                <span>Subscriptions</span>
                            </Link>
                        </li>
                    </ul>

                    <div className="admin-logout-section">
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/admin/login');
                        }} className="admin-logout-button">
                            <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

        </div>
    );
}

export default AdminSidebar;