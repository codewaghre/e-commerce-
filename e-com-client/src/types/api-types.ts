
import { User, Product, Stats, Pie, Bar, Line, CouponType, formData } from "./types"
import { ShippingInfo, CartItem ,Order} from "./types";


// message Responnse and Error Response
export type MessageResponse = {
  success: boolean;
  message: string;
  error?: string
};

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

// User Route Response and requesrt
export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
  error?: string
};


//Product Route Response and Request
export type AllProductsResponse = {
  success: boolean;
  products: Product[];
  error?: string
};


export type CategoriesResponse = {
  success: boolean;
  message: string,
  categories: string[];
};

export type SearchProductsResponse = AllProductsResponse & {
  message: string,
  totalPages: number;
};


export type SearchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};


export type ProductResponse = {
  success: boolean
  message?: string
  product: Product
}

export type NewProductRequest = {
  id: string;
  formData: FormData;
};



// Order Route Response and Request
export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type AllOrdersResponse = {
  success: boolean;
  ordersCount: number
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
}

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
}


//Dashboard Stats 
export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};



// Coupons
export type AllDiscountResponse = {
  success: boolean;
  coupons: CouponType[];
};

export type SingleDiscountResponse = {
  success: boolean;
  coupon: CouponType;
};

export type DiscountRequest = {
  userId: string;
  discountId: string;
}

export type CouponCodeRequest = {
  formData: formData
  id: string
}