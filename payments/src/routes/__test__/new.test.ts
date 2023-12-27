import request from "supertest";
import app from "../../app";
import mongoose, { mongo } from "mongoose";
import Order from "../../models/order";
import { OrderStatus } from "@amritorg/common";
import { stripe } from "../../stripe";
import Payments from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  let cookie = global.signup();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: "asdfa",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("returns a 401 when purchasing order that does not belong to the user", async () => {
  let cookie = global.signup();

  let order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "sdfa",
    price: 434,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: "asdfa",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing cancelled order", async () => {
  let userId = new mongoose.Types.ObjectId().toHexString();
  let cookie = global.signup(userId);
  let otheruser = global.signup();
  let order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 434,
    status: OrderStatus.Cancelled,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: "asdfa",
      orderId: order.id,
    })
    .expect(400);
});

// it("returns a 204 with valid inputs", async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();

//   let order = Order.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     userId: userId,
//     price: 434,
//     status: OrderStatus.Cancelled,
//     version: 0,
//   });

//   await order.save();

//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", global.signup(userId))
//     .send({
//       token: "tok_visa",
//       orderId: order.id,
//     })
//     .expect(201);

//   let chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual("tok_visa");
//   expect(chargeOptions.amount).toEqual(20 * 100);
//   expect(chargeOptions.currency).toEqual("usd");
// });
it("returns a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  let order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 434,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  let chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(434 * 100);
  expect(chargeOptions.currency).toEqual("usd");

  const payment = await Payments.findOne({
    orderId: order.id,
  });

  expect(payment).not.toBeNull();
  expect(payment?.orderId).toEqual(order.id);
});
