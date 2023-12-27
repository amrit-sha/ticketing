import app from "./app";
import mongoose from "mongoose";
const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("jwt key must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("mongo uri must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
