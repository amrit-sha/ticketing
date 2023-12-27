import mongoose, { InferSchemaType, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

interface TicketModel extends Model<ITicketDoc> {
  build(data: ITicket): ITicketDoc;
}

interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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
// schema.pre("save", function (done) {
//   this.$where = {
//     version: this.get("version") - 1,
//   };
//   done();
// });

schema.statics.build = (attrs: ITicket) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<ITicket, TicketModel>("Ticket", schema);

export default Ticket;
