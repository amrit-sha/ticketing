import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUser, errorHandler } from "@amritorg/common";
import { NotFoundError } from "@amritorg/common";
import { paymentsRouter } from "./routes";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(paymentsRouter);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export default app;
