import mongoose from "mongoose";

const learningModuleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    readMinutes: { type: Number, default: 7 },
    level: { type: String, enum: ["Beginner", "Intermediate"], default: "Beginner" },
    content: [{ heading: String, body: String }],
    takeaways: [String],
    quiz: [
      {
        question: String,
        options: [String],
        correctIndex: Number,
        explanation: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("LearningModule", learningModuleSchema);

