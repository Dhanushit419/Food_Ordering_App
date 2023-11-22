import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Pages/register';
import Login from './Pages/login';
import Profile from './Pages/profile';
import Orders from './Pages/orders';
import OrderSuccess from './Pages/orderSuccess';
import Menu from './Pages/menu.js'
import Start from './Pages/start.js'
import AdminLogin from './Pages/admin/adminLogin';
import AddMenu from './Pages/admin/addMenu';
import Cart from './Pages/cart.js'
//importing styles.js 
import './styles.js'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route element={<AdminLogin />} path='/adminlogin' />
        <Route element={<AddMenu />} path='/addmenu' />

        <Route element={<Start />} path='/' />
        <Route element={<Login />} path='/login' />
        <Route element={<Register />} path='/register' />
        <Route element={<Profile />} path='/profile' />
        <Route element={<Cart />} path='/cart' />

          <Route element={<Orders />} path='/orders' />
          <Route element={<OrderSuccess />} path='/orderSuccess' />
          <Route element={<Menu />} path='/menu' />

         
        </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
