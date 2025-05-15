import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import AdminLogin from "./Components/Admin/Auth/Login";
import NotFound from "./Components/404NotFound/NotFound";
import AdminViewProducts from "./Components/Admin/Products/Index";
import AdminProductsDetails from "./Components/Admin/Products/View";
import AdminEditProduct from "./Components/Admin/Products/Edit";
import AdminAddProduct from "./Components/Admin/Products/Create";
import AdminViewCategories from "./Components/Admin/Categories/Index";
import AdminAddCategory from "./Components/Admin/Categories/Create";
import AdminEditCategory from "./Components/Admin/Categories/Edit";
import AdminProfile from "./Components/Admin/AdminProfile";
import AdminViewOrders from "./Components/Admin/Orders/Index";
import AdminOrderDetails from "./Components/Admin/Orders/View";
import AdminPlaceOrder from "./Components/Admin/Orders/Create";
import AdminViewStock from "./Components/Admin/Stock/Index";

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/admin/login" element={<AdminLogin />}></Route>
        <Route path="/admin/profile" element={<AdminProfile />}></Route>

        <Route path="/admin/products" element={<AdminViewProducts />}></Route>
        <Route path="/admin/products/view/:id" element={<AdminProductsDetails />}></Route>
        <Route path="/admin/products/edit/:id" element={<AdminEditProduct />}></Route>
        <Route path="/admin/products/new" element={<AdminAddProduct />}></Route>

        <Route path="/admin/categories" element={<AdminViewCategories />}></Route>
        <Route path="/admin/categories/new" element={<AdminAddCategory />}></Route>
        <Route path="/admin/categories/edit/:id" element={<AdminEditCategory />}></Route>

        <Route path="/admin/orders" element={<AdminViewOrders />}></Route>
        <Route path="/admin/orders/new" element={<AdminPlaceOrder />}></Route>
        <Route path="/admin/orders/view/:id" element={<AdminOrderDetails />}></Route>
        
        <Route path="/admin/stocks" element={<AdminViewStock />}></Route>




        <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
