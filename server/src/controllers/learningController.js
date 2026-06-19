import LearningModule from "../models/LearningModule.js";
import LearningProgress from "../models/LearningProgress.js";
import User from "../models/User.js";
import { AppError, asyncHandler, ok } from "../utils/http.js";

export const listModules = asyncHandler(async (req, res) => {
  const [modules, progress] = await Promise.all([
    LearningModule.find().select("-quiz.correctIndex").sort({ category: 1, title: 1 }),
    LearningProgress.find({ user: req.user._id })
  ]);
  const progressByModule = new Map(progress.map((item) => [item.module.toString(), item]));
  return ok(res, {
    modules: modules.map((module) => ({
      ...module.toObject(),
      progress: progressByModule.get(module._id.toString()) || null
    }))
  });
});

export const getModule = asyncHandler(async (req, res) => {
  const module = await LearningModule.findOne({ slug: req.params.slug }).select("-quiz.correctIndex");
  if (!module) throw new AppError(404, "Learning module not found");
  const progress = await LearningProgress.findOne({ user: req.user._id, module: module._id });
  return ok(res, { module, progress });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const module = await LearningModule.findOne({ slug: req.params.slug });
  if (!module) throw new AppError(404, "Learning module not found");
  const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const results = module.quiz.map((question, index) => ({
    correct: answers[index] === question.correctIndex,
    correctIndex: question.correctIndex,
    explanation: question.explanation
  }));
  const correct = results.filter((item) => item.correct).length;
  const score = module.quiz.length ? Math.round((correct / module.quiz.length) * 100) : 100;
  const completed = score >= 70;
  const progress = await LearningProgress.findOneAndUpdate(
    { user: req.user._id, module: module._id },
    { $set: { score, completed, completedAt: completed ? new Date() : null }, $inc: { attempts: 1 } },
    { new: true, upsert: true }
  );
  if (completed) await User.updateOne({ _id: req.user._id }, { $addToSet: { badges: `${module.category} Explorer` } });
  return ok(res, { score, completed, results, progress });
});

