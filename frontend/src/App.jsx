import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Home from './components/Home/Home'
import ProductsPage from './pages/ProductsPage'

import Contact from './pages/Contact'
import About from "./pages/About";
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import ScrollToTop from './components/ScrollToTop'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from "./pages/Checkout";
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import MyCoupons from "./pages/MyCoupons";
function App() {
  return (
    <BrowserRouter>
     <ScrollToTop />
   <Routes>
    <Route path = "/register" element = {<Register/>}/>
    <Route path = "/login" element = {<Login/>}/>
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route element = {<ProtectedRoute/>}>
    <Route path = "/" element= {<Home/>}/>
    <Route path = "/products" element = {<ProductsPage/>}/>
     <Route path="/checkout" element={<Checkout />} />
    <Route path = "/contact" element={<Contact/>}/>
    <Route path = "/about" element={<About/>}/>
    <Route path = "/cart" element={<Cart/>}/>
      <Route
        path="/products/:slug"
        element={<ProductDetails />}
      />
      <Route path = "/profile" element={<Profile/>}/>
      <Route path = "/myorders" element={<MyOrders/>}/>
      <Route path="/my-coupons" element={<MyCoupons />} />


    </Route>
   </Routes>
   

    </BrowserRouter>
  )
}

export default App
