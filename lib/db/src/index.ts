import mongoose from "mongoose";
export * from "./models/index.js";

export async function connectToDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI must be set. Please add your MongoDB connection string.",
    );
  }
  await mongoose.connect(mongoUri);
}
