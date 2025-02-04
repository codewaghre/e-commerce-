
import { FaHeadset } from "react-icons/fa6";
import { LuShieldCheck } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Skeleton } from "../components/laoder";
import ProductCart from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";

import { Slider } from "6pp";
import { banners, categories, clients } from '../features/help';

import { motion } from "framer-motion";


export const services = [
  {
    icon: <TbTruckDelivery />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $200",
  },
  {
    icon: <LuShieldCheck />,
    title: "SECURE PAYMENT",
    description: "100% secure payment",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 SUPPORT",
    description: "Get support 24/7",
  },
];

function Home() {

  const dispatch = useDispatch()
  const { data, isLoading, isError } = useLatestProductsQuery("")
  // console.log("data", data?.products[0].photos[0].url);
  
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  }
  
  if (isError) toast.error("Cannot Fetch Products")
  
  return (
    <>
      <div className="home">
         <div>
          <aside>
            <h1>Categories</h1>
            <ul>
              {categories.map((i) => (
                <li key={i}>
                  <Link to={`/search?category=${i.toLowerCase()}`}>{i}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="banner">
            <Slider
            autoplay
            autoplayDuration={1500}
            showNav={false}
            images={banners}
          />
          </div>
        </div>


       

        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>

        <main>

          { isLoading ? (  <>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ height: "25rem" }}>
                  <Skeleton width="18.75rem" length={1} height="20rem" />
                  <Skeleton width="18.75rem" length={2} height="1.95rem" />
                </div>
              ))}
            </>):
            data?.products.map((i) => (
              <ProductCart
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                photos={i.photos}
                handler={addToCartHandler}
              />
            ))
          }
         
        </main>


      <article className="our-clients">
        <div>
          <h2>Our Clients</h2>
          <div>
            {clients.map((client, i) => (
              <motion.img
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: i / 20,
                    ease: "circIn",
                  },
                }}
                src={client.src}
                alt={client.alt}
                key={i}
              />
            ))}
            </div>
          </div>
        </article>
        

        <article className="our-services">
          
        <ul>
          {services.map((service, i) => (
            <motion.li
              initial={{ opacity: 0, y: -100 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: i / 20,
                },
              }}
              key={service.title}
            >
              <div>{service.icon}</div>
              <section>
                <h3>{service.title}Y</h3>
                <p>{service.title}</p>
              </section>
            </motion.li>
          ))}
        </ul>
      </article>

      </div>

    </>
  )
}

export default Home