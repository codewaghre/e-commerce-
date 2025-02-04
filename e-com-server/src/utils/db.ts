import mongoose, { ConnectOptions } from "mongoose";
import { DB_NAME } from "../utils/contance.js";

const connectDB = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Database Connected: ${connection.connection.host}`);

        mongoose.connection.on("error", (error: Error) => {
            console.log(`Database Connection Error: ${error.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB Disconnected, Attempting to reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            console.info("MongoDB reconnected successfully");
        });

    } catch (error: any) {
        console.log(`Error connecting to DB: ${error.message}`);
        process.exit(1);
    }
};

export  {connectDB};