import { OrderStatus } from "@amritorg/common";
import mongoose, { InferSchemaType, Model } from "mongoose";
import Order from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket {
  title: string;
  price: number;
  id: string;
}

export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}
interface TicketModel extends Model<ITicketDoc> {
  build(data: ITicket): ITicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ITicketDoc | null>;
}
const schema = new mongoose.Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

schema.statics.build = (attrs: ITicket) => {
  return new Ticket({ _id: attrs.id, title: attrs.title, price: attrs.price });
};
schema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
};

schema.methods.isReserved = async function () {
  // this === the current ticket document
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};
schema.set("versionKey", "version");
schema.plugin(updateIfCurrentPlugin);

type TicketSchemaT = InferSchemaType<typeof schema>;

const Ticket = mongoose.model<ITicket, TicketModel>("Ticket", schema);

export default Ticket;
