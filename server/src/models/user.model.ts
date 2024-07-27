import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
    id: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const UserModel = mongoose.model<IUser>("User", UserSchema)

export default UserModel