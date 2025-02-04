import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTrash } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { Skeleton } from '../../../components/laoder';
import { responseToast } from '../../../features/feature';
import { useDeleteCouponMutation, useSingleCouponQuery, useUpdateCouponMutation } from '../../../redux/api/couponAPI';
import { CustomError } from '../../../types/api-types';
import { UserReducerInitialState } from '../../../types/reducer-types';

function DiscountManagement() {
    
    const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading, isError, error } = useSingleCouponQuery({
        userId: user?._id!,
        discountId: id!,
    });

    const [newCoupon] = useUpdateCouponMutation()
    const [deleteCoupon] = useDeleteCouponMutation()


    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const [code, setCode] = useState("");
    const [amount, setAmount] = useState(0);

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setBtnLoading(true)

        try {
        
            if (!code || !amount) {
                toast.error("Please fill all fields")
            }
            const couponData = { code, amount };
            
            const res = await newCoupon({ formData: couponData, adminID: user?._id!, discountId:id });
            console.log(res);
            
            responseToast(res, navigate, "/admin/coupon")
        } catch (error) {
            console.log(error);
            
        } finally {
            setBtnLoading(false)
        }
  }
  
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }


    const deleteHandler = async() => { 
    const res = await deleteCoupon({
        adminID: user?._id!,
         discountId:id
    });
     responseToast(res, navigate, "/admin/coupon");
    }
    
    useEffect(() => {
        if (data && data.coupon) {
            setAmount(data.coupon.amount)
            setCode(data.coupon.code)
        }
    }, [data])

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
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
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  )
}

export default DiscountManagement