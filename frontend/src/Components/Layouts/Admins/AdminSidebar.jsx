import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/logo.png'
import './AdminSidebar.css'

function AdminSidebar() {

    const navigate = useNavigate()

    return (
        <div className="admin-sidebar-container">
            <aside className="admin-sidenav">
                <div className="admin-sidenav-header">
                    <Link className="admin-navbar-brand">
                        <img src={logo} className="admin-navbar-brand-img" width="30" height="30" alt="Releans Logo" />
                        <span>Releans</span>
                    </Link>
                </div>

                <div className="admin-navbar-collapse">
                    <ul className="admin-navbar-nav">

                        <li className="admin-nav-item">
                            <Link to="/admin/profile" className="admin-nav-link">
                                {/* <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                </svg> */}
                                <span>Profile</span>
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link to="/admin/products" className="admin-nav-link">
                                {/* <svg className="admin-nav-icon" viewBox="0 0 24 24" >
                                    <path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg> */}
                                <span>Products</span>
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link to="/admin/categories" className="admin-nav-link">
                                {/* <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill='currentColor' d="M8 4C8 5.10457 7.10457 6 6 6 4.89543 6 4 5.10457 4 4 4 2.89543 4.89543 2 6 2 7.10457 2 8 2.89543 8 4ZM5 16V22H3V10C3 8.34315 4.34315 7 6 7 6.82059 7 7.56423 7.32946 8.10585 7.86333L10.4803 10.1057 12.7931 7.79289 14.2073 9.20711 10.5201 12.8943 9 11.4587V22H7V16H5ZM10 5H19V14H10V16H14.3654L17.1889 22H19.3993L16.5758 16H20C20.5523 16 21 15.5523 21 15V4C21 3.44772 20.5523 3 20 3H10V5Z" />
                                </svg> */}
                                <span>Categories</span>
                            </Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link to="/admin/orders" className="admin-nav-link">
                                {/* <svg className="admin-nav-icon" viewBox="0 0 24 24" >
                                    <path fill="currentColor" d="M21 4H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H7v2h10v-2h-2v-2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H3V6h18v10zm-10-1 5-3-5-3v6z" />
                                </svg> */}
                                <span>Orders</span>
                            </Link>
                        </li>
                        <li className="admin-nav-item">
                            <Link to="/admin/stocks" className="admin-nav-link">
                                {/* <svg className="admin-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg> */}
                                <span>Stock</span>
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