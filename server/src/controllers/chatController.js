import ChatSession from "../models/ChatSession.js";
import Portfolio from "../models/Portfolio.js";
import { askAdvisor } from "../services/aiService.js";
import { AppError, asyncHandler, ok } from "../utils/http.js";

export const listSessions = asyncHandler(async (req, res) => {
  const sessions = await ChatSession.find({ user: req.user._id }).select("title createdAt updatedAt").sort({ updatedAt: -1 });
  return ok(res, { sessions });
});

export const getSession = asyncHandler(async (req, res) => {
  const session = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw new AppError(404, "Chat session not found");
  return ok(res, { session });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = String(req.body.message || "").trim();
  if (!message || message.length > 2000) throw new AppError(400, "Message must be between 1 and 2000 characters");

  let session;
  if (req.body.sessionId) {
    session = await ChatSession.findOne({ _id: req.body.sessionId, user: req.user._id });
    if (!session) throw new AppError(404, "Chat session not found");
  } else {
    session = new ChatSession({ user: req.user._id, title: message.slice(0, 72), messages: [] });
  }

  const portfolios = await Portfolio.find({ user: req.user._id });
  const answer = await askAdvisor({
    message,
    history: session.messages,
    user: req.user,
    portfolios
  });
  session.messages.push({ role: "user", content: message });
  session.messages.push({ role: "assistant", content: answer.content });
  await session.save();
  return ok(res, { session, answer }, 201);
});

export const removeSession = asyncHandler(async (req, res) => {
  const result = await ChatSession.deleteOne({ _id: req.params.id, user: req.user._id });
  if (!result.deletedCount) throw new AppError(404, "Chat session not found");
  return ok(res, { deleted: true });
});

