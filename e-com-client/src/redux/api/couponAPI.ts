import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllDiscountResponse, DiscountRequest, MessageResponse, SingleDiscountResponse,CouponCodeRequest } from "../../types/api-types";




export const couponApi = createApi({
    reducerPath: "couponApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
    }),
    tagTypes: ["coupon"],
    endpoints: (builder) => ({
        allCoupon: builder.query<AllDiscountResponse, string>({
            query: (id) => ({
                url: `coupon/all?id=${id}`,
                method: "GET"
            }),
            providesTags: ["coupon"]
        }),

        newCoupon: builder.mutation<MessageResponse, CouponCodeRequest >({
            query: ({ formData, id }) => ({
                url: `coupon/new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["coupon"],
        }),

        singleCoupon: builder.query<SingleDiscountResponse, DiscountRequest>({
                query: ({userId, discountId}) => `coupon/${discountId}?id=${userId}`,
                providesTags: ["coupon"],
        }),
                
        
        updateCoupon: builder.mutation({
            query: ({discountId, adminID, formData }) => ({
                url: `coupon/${discountId}?id=${adminID}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["coupon"],

        }),

        deleteCoupon: builder.mutation({
            query: ({ adminID,  discountId }) => ({
                url: `coupon/${discountId}?id=${adminID}`,
                method:"DELETE"
            }),
            invalidatesTags: ["coupon"],
        })
    })
})

export const { useAllCouponQuery, useDeleteCouponMutation, useUpdateCouponMutation, useNewCouponMutation, useSingleCouponQuery} = couponApi