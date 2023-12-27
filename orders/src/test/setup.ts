import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import jwt from "jsonwebtoken";

declare global {
  function signup(): string[];
}
process.env.NODE_ENV = "test";
jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "asldfj";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo?.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  let payload = {
    email: "test@test.com",
    id: new mongoose.Types.ObjectId().toHexString(),
  };

  let token = jwt.sign(payload, process.env.JWT_SECRET!);

  // express-cookie encodes token as {jwt:token} into base64
  const sessionJSON = JSON.stringify({ jwt: token });

  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
