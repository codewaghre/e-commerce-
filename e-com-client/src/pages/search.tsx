import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Skeleton } from "../components/laoder";
import ProductCard from "../components/product-card";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";


function Search() {

  const dispatch = useDispatch()
  const { data: categoriesResponse, isError, isLoading: loadingCategories, error } = useCategoriesQuery("")
  // console.log("categoriesResponse",categoriesResponse);

  const location = useLocation();
const searchQuery = new URLSearchParams(location.search);
  
  

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);

  const isPrevPage = page > 1;
  const isNextPage = page < 4;


  const { isLoading: productLoading, data: searchedData, isError: productIsError, error: productError, } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  // console.log("searchedData", searchedData);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem))
    toast.success("Added to cart");
  }
  
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productError as CustomError 
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
       <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

       <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        
        {
          productLoading ? (<Skeleton length={10} />) : (
            <div className="search-product-list">
             {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photos={i.photos}
              />
            ))}
        </div>
          )
        }
       
       
                
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {4}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        
      </main>
    </div>
  )
}

export default Search