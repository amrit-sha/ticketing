import { OrderStatus } from "@amritorg/common";
import mongoose, { InferSchemaType, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IOrder {
  userId: string;
  status: OrderStatus;
  id: string;
  version: number;
  price: number;
}

interface OrderModel extends Model<IOrderDoc> {
  build(data: IOrder): IOrderDoc;
}

interface IOrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
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

    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        // delete ret._v;
      },
    },
  }
);
schema.set("versionKey", "version");
schema.plugin(updateIfCurrentPlugin);
schema.statics.build = (attrs: IOrder) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
  });
};

type OrderSchemaT = InferSchemaType<typeof schema>;

const Order = mongoose.model<OrderSchemaT, OrderModel>("Order", schema);

export default Order;
