import mongoose, { InferSchemaType, Model } from "mongoose";
import { Password } from "../services/password";

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  build(data: IUser): IUserDoc;
}

interface IUserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const schema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

schema.statics.build = (attrs: IUser) => {
  return new User(attrs);
};
schema.pre("save", async function (cb) {
  if (this.isModified("password")) {
    const hashed = await new Password().toHash(this.get("password"));
    this.set("password", hashed);
  }

  cb();
});

type UserSchemaT = InferSchemaType<typeof schema>;

const User = mongoose.model<UserSchemaT, UserModel>("User", schema);

export default User;
