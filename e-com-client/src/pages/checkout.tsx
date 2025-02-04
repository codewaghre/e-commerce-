import {Elements, PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CartReducerInitialState, UserReducerInitialState } from '../types/reducer-types';
import { NewOrderRequest } from '../types/api-types';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { responseToast } from '../features/feature';
import { useNewOrderMutation } from '../redux/api/orderAPI';
import { resetCart } from '../redux/reducer/cartReducer';


const stripeKey = import.meta.env.VITE_STRIPE_KEY

const stripePromise = loadStripe(stripeKey);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
      const [newOrder] = useNewOrderMutation();

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
    } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    

    const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setIsProcessing(true);

        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user?._id!,
        };

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something Went Wrong");
        }
        if (paymentIntent.status === "succeeded") {
            const res = await newOrder(orderData);
            dispatch(resetCart());
            responseToast(res, navigate, "/orders");

            console.log("Placeing Order");
            navigate("/orders")
            
        }
        setIsProcessing(false);
    }

    
    

    return <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
}

const Checkout = () => {
     
    const location = useLocation();
    const clientSecret: string | undefined = location.state;
    if (!clientSecret) return <Navigate to={"/shipping"} />;

  return <Elements stripe={stripePromise} options={{ clientSecret }} >
    <div style={{color: "red", marginTop: "10px", textAlign: "center"}}>
      <h5>For Testing Payment Gatewat use this :-  <span style={{ color: "green" }}>4242 4242 4242 4242 <span style={{color: "black"} }>&</span> 1234 1234 1234 1239</span></h5>
    </div>
      <CheckoutForm />
    </Elements>
}

export default Checkout