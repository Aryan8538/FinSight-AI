import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningModule",
      required: true,
      index: true
    },
    completed: { type: Boolean, default: false },
    score: { type: Number, min: 0, max: 100, default: 0 },
    attempts: { type: Number, default: 0 },
    completedAt: Date
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, module: 1 }, { unique: true });

export default mongoose.model("LearningProgress", progressSchema);

