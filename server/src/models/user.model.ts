import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  fullname: string;
  email: string;
  password: string;
  avatar: string
}

const UserSchema: Schema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: "https://img.icons8.com/tiny-color/32/000000/test-account.png",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
