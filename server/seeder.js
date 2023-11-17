import dotenv from "dotenv";
import colors from "colors";

import users from "./data/users.js";
import connectDB from "./config/db.js";
import User from "./models/userModel.js";
import products from "./data/products.js";
import Order from "./models/orderModel.js";
import Product from "./models/productModel.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    // Find the admin user from the created users
    const adminUser = createdUsers.find((user) => user.isAdmin === true);

    if (!adminUser) {
      console.error("Admin user not found in the users array".red.inverse);
      process.exit(1);
    }

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log("Inserted products and users".green.inverse);
    process.exit();
  } catch (error) {
    console.error(
      `Error inserting products: ${error || error.message}`.red.inverse
    );
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error deleting data ${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
