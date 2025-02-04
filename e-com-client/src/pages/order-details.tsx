import { Link, useParams } from 'react-router-dom';
import { Skeleton } from '../components/laoder';
import { useOrderDetailsQuery } from '../redux/api/orderAPI';
import { Order, OrderItem } from '../types/types';
import toast from 'react-hot-toast';
import { CustomError } from '../types/api-types';

const defaultData: Order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
};

function OrderDetails() {

     const params = useParams()
    const { data, isLoading, isError, error } = useOrderDetailsQuery(params.id!)
    
    const {
    shippingInfo: { address, city, state, country, pinCode },
    orderItems,
    user: { name },
    status,
    tax,
    subtotal,
    total,
    discount,
    shippingCharges,
  } = data?.order || defaultData;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
    return (
       <div className="order-container">
      <main className="order-management">

        {
          isLoading ? (<Skeleton />) : <>
            <section style={{
                padding: "2rem",
            }}>
              
              <h2>Order Items</h2>
              
              {orderItems.map((i) => (
                
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={i.photo}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>
            
            <article className="shipping-info-card">

              
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              
              <p>
                Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>
              <h5>Status Info</h5>
          
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                        ? "green"
                        : "red"
                  }
                >
                  {status}
                </span>
              </p>
          
            </article>
          </>
        }
      </main>
    </div>
  )
}

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default OrderDetails