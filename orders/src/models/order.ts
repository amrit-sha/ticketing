import { OrderStatus } from "@amritorg/common";
import mongoose, { InferSchemaType, Model } from "mongoose";
import { ITicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;
}

interface OrderModel extends Model<IOrderDoc> {
  build(data: IOrder): IOrderDoc;
}

interface IOrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;
}

const schema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret._v;
      },
    },
  }
);
schema.set("versionKey", "version");
schema.plugin(updateIfCurrentPlugin);
schema.statics.build = (attrs: IOrder) => {
  return new Order(attrs);
};

type OrderSchemaT = InferSchemaType<typeof schema>;

const Order = mongoose.model<OrderSchemaT, OrderModel>("Order", schema);

export default Order;
