import mongoose from "mongoose";

export const mongoBDConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongodb connected successfully`.bgYellow.black.bold);
  } catch (error) {
    console.log(`${error.message}`.bgRed.black);
  }
};
