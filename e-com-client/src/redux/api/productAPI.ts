import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoriesResponse, MessageResponse, NewProductRequest, ProductResponse, SearchProductsRequest, SearchProductsResponse } from "../../types/api-types";



export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
    }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({
            query: () => "latest",
            providesTags: ["product"],
        }),
        allProducts: builder.query<AllProductsResponse, string>({
            query: (id) => `admin-product?id=${id}`,
            providesTags: ["product"],
        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => `categories`,
            providesTags: ["product"],
        }),

        searchProducts: builder.query<SearchProductsResponse, SearchProductsRequest>({
            query: ({ price, search, sort, category, page }) => {
                let base = `all?search=${search}&page=${page}`

                if (price) base += `&price=${price}`;
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;
                return base;
            },
            providesTags: ["product"],
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["product"],
        }),
        
        productDetails: builder.query<ProductResponse, string>({
            query: (id) => id,
            providesTags: ["product"],
        }),

        updateProduct: builder.mutation({
            query: ({productID, adminID, formData }) => ({
                url: `${productID}?id=${adminID}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["product"],

        }),

        deleteProduct: builder.mutation({
            query: ({ adminID, productID }) => ({
                url: `${productID}?id=${adminID}`,
                method:"DELETE"
            }),
            invalidatesTags: ["product"],
        })
        


    })
})

export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery, useNewProductMutation, useUpdateProductMutation, useProductDetailsQuery , useDeleteProductMutation} = productAPI