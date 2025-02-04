import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useParams } from "react-router-dom";
import { Skeleton } from "../components/laoder";
import { useProductDetailsQuery } from "../redux/api/productAPI";

import {
  FaArrowLeftLong,
  FaArrowRightLong
} from "react-icons/fa6";

import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { CustomError } from "../types/api-types";



function ProductDetails() {
    const params = useParams();
    console.log(params.id);
    
    const { isError, error, isLoading, data } = useProductDetailsQuery(params.id!)
    const dispatch = useDispatch()

    const [carouselOpen, setCarouselOpen] = useState(false);
     const [quantity, setQuantity] = useState(1);


    const decrement = () => {setQuantity((prev) => {
    if (prev === 1) return prev; // Prevent going below 1
      return prev - 1;
    });
    };

    const increment = () => {
    if (data?.product?.stock === quantity)
            return toast.error(`${data?.product?.stock} available only`);
      setQuantity((prev) => prev + 1);
    };
  

    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock");

        dispatch(addToCart(cartItem));
        toast.success("Added to cart");
  };
  
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
    
  

  return (
      <div className="product-details">
          {
              isLoading ? (<ProductLoader />) : <>
              
                  <main>
                      <section>
                          <Slider 
                              showThumbnails
                              objectFit="cover"
                              NextIcon={<FaArrowRightLong />}
                              PrevIcon={<FaArrowLeftLong />}
                              onClick={() => setCarouselOpen(true)}
                              images={data?.product.photos.map(i => i.url) || []} />
                          
                          {carouselOpen && (
                              <MyntraCarousel
                                  darkMode={true}
                                  NextButton={NextButton}
                                  PrevButton={PrevButton}
                                  setIsOpen={setCarouselOpen}
                                  images={data?.product?.photos.map((i) => i.url) || []}
                              />
                          )}
                      </section>

                      <section>
                          <code>{data?.product?.category}</code>
                          <h1>{data?.product?.name}</h1>
                          <h3>₹{data?.product?.price}</h3>
                          <article>
                              <div>
                                  <button onClick={decrement}>-</button>
                                  <span>{quantity}</span>
                                  <button onClick={increment}>+</button>
                              </div>
                              <button
                                  onClick={() =>
                                      addToCartHandler({
                                          productId: data?.product?._id!,
                                          name: data?.product?.name!,
                                          price: data?.product?.price!,
                                          stock: data?.product?.stock!,
                                          quantity,
                                          photo: data?.product?.photos[0].url || "",
                                      })}>
                                  Add To Cart
                              </button>
                          </article>
                          <p>{data?.product?.description}</p>
                      </section>
                  </main>
              </>
        }
          
      </div>
  )
}

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          width="100%"
          containerHeight="100%"
          height="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton width="40%" length={3} />
        <Skeleton width="50%" length={4} />
        <Skeleton width="100%" length={2} />
        <Skeleton width="100%" length={10} />
      </section>
    </div>
  );
};


const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);
const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);


export default ProductDetails