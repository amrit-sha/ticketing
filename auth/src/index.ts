import express from "express";
import "express-async-errors";
import mongoose, { connect } from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { signOutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);
const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
