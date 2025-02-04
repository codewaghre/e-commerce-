import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { responseToast } from '../../../features/feature';
import { useNewCouponMutation } from '../../../redux/api/couponAPI';
import { RootState } from '../../../redux/store';

function NewDiscount() {
    
    const { user } = useSelector((state: RootState) => state.userReducer);
    const [code, setCode] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [btnLoading, setIsLoading] = useState<boolean>(false);

    const [newCoupon] = useNewCouponMutation()
    
    const navigate = useNavigate()

    const submitHandler =async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            
            
            if (!code || !amount) {
                toast.error("Please Fill all Fileds")
            }

            const couponData = { code, amount };

        

            const res = await newCoupon({ formData: couponData, id: user?._id! });
            responseToast(res, navigate, "/admin/coupon")



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
          <form onSubmit={submitHandler}>
            <h2>New Coupon</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <button disabled={btnLoading} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  )
}

export default NewDiscount