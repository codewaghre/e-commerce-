import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/laoder";
import { responseToast } from "../../../features/feature";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { CustomError } from "../../../types/api-types";
import { UserReducerInitialState } from "../../../types/reducer-types";


const Productmanagement = () => {
  
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  const params = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useProductDetailsQuery(params.id!)

  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  console.log("data", data);
  
   const { price, photos, name, stock, category, description} = data?.product || {
      photos: [],
      category: "",
      name: "",
      stock: 0,
      price: 0,
      description: "",
    };
  

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [newPhotos, setNewPhotos] = useState<boolean>(false)
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
   const [descriptionUpdate, setDescriptionUpdate] =useState<string>(description);
 
  const photosFiles = useFileHandler("multiple", 10, 5);



  const submitHandler = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true)
    try {
      const formData = new FormData();

      if (nameUpdate) formData.set("name", nameUpdate);
      // if (descriptionUpdate) formData.set("description", descriptionUpdate);
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (stockUpdate !== undefined)
        formData.set("stock", stockUpdate.toString());

      if (categoryUpdate) formData.set("category", categoryUpdate);

      if (photosFiles.file && photosFiles.file.length > 0) {
        photosFiles.file.forEach((file) => {
          formData.append("photos", file);
        });
      }

        const res = await updateProduct({
        formData,
        adminID: user?._id!,
        productID: data?.product._id!,
        });
      
      responseToast(res, navigate, "/admin/product")
    } catch (error) {
      const err = error as CustomError;
      toast.error(err.data.message);
      
    } finally {
      setBtnLoading(false);
      setNewPhotos(true)
    }
  }; 

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }


  const deleteHandler = async () => {
    const res = await deleteProduct({
      adminID: user?._id!,
      productID: data?.product._id!,
    });

     responseToast(res, navigate, "/admin/product");
  }

  useEffect(() => {
    if (data) {
       setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setDescriptionUpdate(data.product.description);
    }
  }, [data])

  console.log(newPhotos);
  

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">


        {isLoading ? (<Skeleton length={20} />) : (
          <>
            <section>
              <strong>ID - {data?.product._id || "NO_ID"}</strong>
              <img src={photos[0]?.url} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>

        {/* side Articel */}
        <article>
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
                </div>
                 <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            
                <div>
                  <label>Photo</label>
                  <input type="file" multiple onChange={photosFiles.changeHandler} />
                </div>

                <div style={{color: "red" , textAlign: "center"}}>
                  {photosFiles.error && <p>{photosFiles.error}</p>}
                </div>


                    <div className="photo-gallary">
                      {photosFiles.preview &&
                      photosFiles.preview.map((img, i) => (
                      <img className="photo-set" key={i} src={img} alt="New Image" />
                      ))}
                    </div>


                <button disabled={btnLoading} onClick={() => setNewPhotos(true)} type="submit">Update</button>
          </form>
        </article>
          </>
        )}
       
      </main>
    </div>
  );
};

export default Productmanagement;
