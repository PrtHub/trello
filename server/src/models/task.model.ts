import mongoose, { Document, Schema } from "mongoose";

interface ITask extends Document {
  title: string;
  description?: string;
  status: "To-Do" | "In-Progress" | "Under-Review" | "Completed";
  priority?: "Low" | "Medium" | "Urgent";
  deadline?: Date;
  userId: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["To-Do", "In-Progress", "Under-Review", "Completed"],
    required: true,
  },
  priority: { type: String, enum: ["Low", "Medium", "Urgent"] },
  deadline: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Task = mongoose.model<ITask>("Task", TaskSchema);

export default Task;
