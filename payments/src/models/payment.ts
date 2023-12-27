import { OrderStatus } from "@amritorg/common";
import mongoose, { InferSchemaType, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IPayments {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends Model<IPaymentsDoc> {
  build(data: IPayments): IPaymentsDoc;
}

interface IPaymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

const schema = new mongoose.Schema<IPayments>(
  {
    orderId: {
      type: String,
      required: true,
    },

    stripeId: {
      type: String,
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
schema.statics.build = (attrs: IPayments) => {
  return new Payments({
    ...attrs,
  });
};

type PaymentSchemaT = InferSchemaType<typeof schema>;

const Payments = mongoose.model<PaymentSchemaT, PaymentModel>(
  "Payments",
  schema
);

export default Payments;
