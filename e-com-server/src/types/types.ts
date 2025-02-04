import { NextFunction, Request, Response } from "express";

interface Photo {
  public_id: string;
  url: string;
}

export interface NewUserRequestBody {
    name: string;
    email: string;
    photos: Photo[];
    gender: string;
    _id: string;
    dob: Date;
}


// Type for the TryCatch function
export type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string,any> >>;


export interface NewProductRequestBody {
    name: string;
    price: number
  category: string
  stock: number
    description: string;
  
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}