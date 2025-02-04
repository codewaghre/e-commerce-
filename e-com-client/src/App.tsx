import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import Loader from './components/laoder';
import Header from './components/header';
import Login from './pages/login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { getUser } from './redux/api/userAPI';
import { UserReducerInitialState } from './types/reducer-types';
import ProtectedRoute from './components/protected-route';
import Footer from './components/footer';


const Home = lazy(() => import('./pages/Home')) 
const Cart = lazy(() => import('./pages/cart')) 
const Search = lazy(() => import('./pages/search')) 
const Shipping = lazy(() => import('./pages/shipping'))
const Orders = lazy(() => import('./pages/orders'))
const NotFound = lazy(() => import('./pages/not-found'))
const Checkout = lazy(() => import('./pages/checkout'))
const ProductDetails = lazy(() => import('./pages/product-details'))
const OrderDetails = lazy(() => import('./pages/order-details'))


//Admin 
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const Discount = lazy(() => import('./pages/admin/discount'))
const NewDiscount = lazy(() => import('./pages/admin/management/newdiscount'))
const DiscountManagement = lazy(() => import('./pages/admin/management/discountmanagement'))
function App() {

  const dispatch = useDispatch()
  const { user, loading } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  
  
  

  useEffect(() => {
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        console.log("Logged In");
         const data = await getUser(user.uid);
        dispatch(userExist(data.user))
        
      } else {
        console.log("Not Logged In ");
        dispatch(userNotExist())
      }
    })
  }, [])

  return loading ? <Loader/> : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader/>}>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart/>} />
          <Route path='/search' element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          
          {/* Not logged in page */}

          <Route path='/login' element={
            <ProtectedRoute isAuthenticated={user ? false : true}>
              <Login/>
            </ProtectedRoute>
          } />
         

          {/* Login in user Route */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path='/orders' element={<Orders />} />
            <Route path="/pay" element={<Checkout />} />
            <Route path='/order/:id' element={ <OrderDetails/>} />
          </Route>


          {/* Admin Route */}
          <Route element={<ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={ user?.role === "admin" ? true : false} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path='/admin/coupon' element={<Discount/>} />
          {/* Charts */}
          <Route path="/admin/chart/bar" element={<Barcharts />} />
          <Route path="/admin/chart/pie" element={<Piecharts />} />
          <Route path="/admin/chart/line" element={<Linecharts />} />
          {/* Apps */}
          <Route path="/admin/app/coupon" element={<Coupon />} />
          <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
          <Route path="/admin/app/toss" element={<Toss />} />
          {/* Management */}
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
            
            <Route path='/admin/discount/new' element={<NewDiscount />} />
            <Route path='/admin/discount/:id' element={<DiscountManagement/>} />
          </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      <Footer/>
      <Toaster position="bottom-center" reverseOrder={true}/>
   </Router>
  )
}

export default App