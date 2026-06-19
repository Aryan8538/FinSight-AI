import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    companyName: { type: String, trim: true, default: "" },
    quantity: { type: Number, required: true, min: 0.0001 },
    purchasePrice: { type: Number, required: true, min: 0 },
    purchaseDate: { type: Date, required: true }
  },
  { timestamps: true }
);

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 240, default: "" },
    benchmark: { type: String, default: "SPY", uppercase: true },
    holdings: [holdingSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);

