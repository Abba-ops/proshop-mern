import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Connected to MongoDB at ${db.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.error("Error connecting to MongoDB".red.bold);
    process.exit(1);
  }
};

export default connectDB;
