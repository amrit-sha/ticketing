import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  UnauthorizedError,
  requireAuth,
  validateRequest,
} from "@amritorg/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import Ticket from "../models/ticket";
import Order from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router
  .route("/api/orders")
  .all(requireAuth)
  .get(async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser?.id }).populate(
      "ticket"
    );

    res.json(orders);
  })
  .post(
    [
      body("ticketId")
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("ticketid must be provided"),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { ticketId } = req.body;

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new NotFoundError();
      }

      const isReserved = await ticket.isReserved();
      if (isReserved) {
        throw new BadRequestError("Ticket is already reserved!");
      }

      const expiration = new Date();
      expiration.setSeconds(
        expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
      );

      const order = Order.build({
        userId: req.currentUser?.id as string,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket,
      });
      await order.save();
      new OrderCreatedPublisher(natsWrapper.client).publish({
        orderId: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: { id: order.ticket.id, price: order.ticket.price },
      });
      res.status(201).send(order);
    }
  );
router
  .route("/api/orders/:id")
  .all(requireAuth)
  .get(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params?.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }

    res.send(order);
  })
  .delete(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params?.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      orderId: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    res.status(204).json(order);
  });

export default router;
