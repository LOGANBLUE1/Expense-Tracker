const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    trim: true
  },
  expenseDescription: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Expense", expenseSchema)
