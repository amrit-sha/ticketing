import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
  requireAuth,
  validateRequest,
} from "@amritorg/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import Order from "../models/order";
import { stripe } from "../stripe";
import Payments from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Cannot pay for an completed order");
    }

    let charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
    });

    const payment = Payments.build({ orderId, stripeId: charge.id });

    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      orderId: payment.orderId,
      stripeId: payment.stripeId,
      id: payment.id,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as paymentsRouter };
