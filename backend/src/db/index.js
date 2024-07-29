import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const responForDB = await mongoose.connect(
      `${process.env.DB_URL}/${process.env.DB_NAME}`
    );
    console.log(`MongoDB Connected:  ${responForDB.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connected Error ${process.env.DB_URL}/${process.env.DB_NAME}  ${error.message}`);
  }
};

export default connectDB;
