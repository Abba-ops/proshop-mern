import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); // set __dirname to the current working directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(path.join(__dirname, "/client/build")));

  // any route that is not api will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("API is running"));
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
