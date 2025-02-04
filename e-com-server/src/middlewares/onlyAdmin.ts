
//Middleware  to make sure that only admin is allowed

import { User } from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./asyncHandler.js";

export const onlyAdmin = TryCatch(async (req, res, next) => {
    
    const { id } = req.query
    if (!id) {
        return next(new ErrorHandler("Restricted User", 401))
    }

    const user = await User.findById(id)
    if (!user) {
         return next(new ErrorHandler("User Not Found", 401))
    }

    if (user.role !== "admin") {
        return next(new ErrorHandler("Restricted User", 401))
    }

    next()
})