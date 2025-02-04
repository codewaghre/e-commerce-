import { useFileHandler } from "6pp";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { responseToast } from "../../../features/feature";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { UserReducerInitialState } from "../../../types/reducer-types";



const NewProduct = () => {

  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  
  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate()
  const photos = useFileHandler("multiple", 10, 5);



  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState<string>("");


  // const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file: File | undefined = e.target.files?.[0];

  //   const reader: FileReader = new FileReader();

  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       if (typeof reader.result === "string") {
  //         setPhotoPrev(reader.result);
  //         setPhoto(file);
  //       }
  //     };
  //   } else {
  //     toast.error("Please Upload Photo")
  //   }
  // };

  const submitHadler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!photos.file || photos.file.length  === 0) {
        toast.error("Please Upload Photo")
    } 

    try {
      const formData = new FormData();

      if (!name || !price || stock < 0 || !category ) return;
      if (!photos.file || photos.file.length === 0) return;

      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);
      
      photos.file.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await newProduct({ id: user?._id!, formData });
      responseToast(res, navigate, "/admin/product")
    } catch (error) {
      console.log(error);
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHadler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
              <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" multiple onChange={photos.changeHandler} />
            </div>

            
            {photos.error && <p>{photos.error}</p>}

            <div className="photo-gallary">
              {photos.preview &&
              photos.preview.map((img, i) => (
                <img className="photo-set" key={i} src={img} alt="New Image" />
            ))}
            </div>


            <button disabled={isLoading} type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
