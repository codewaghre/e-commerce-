import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { transformImage } from "../features/feature";
import { CartItem } from "../types/types";

type productsprops = {
    productId: string;
     photos: {
    url: string;
         public_id: string;
     }[];
    name: string;
    price: number;
    stock: number;
    handler: (cartItem  : CartItem) => string | undefined;
}



const ProductCard = ( { productId, photos, name, price, stock, handler}: productsprops) => {
    return (
        <>
            <div className="product-card">
                <img src={transformImage(photos[0].url, 400)} alt={name} />
                <p>{name}</p>
                <span> ₹ {price}</span>

                <div>
                    <button onClick={ () => handler({productId, photo: photos[0].url, name, price, stock, quantity : 1})}>
                        <FaPlus/>
                    </button>
                    <Link to={`/product/${productId}`}>
                        <FaExpandAlt />
                    </Link>
                </div>
            </div>

        </>
    )
   
}

export default ProductCard