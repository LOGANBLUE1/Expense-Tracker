const express = require("express")
const router = express.Router()

// Import the Controllers

const {
  createExpense,
  getAllExpenses,
  editExpense,
  deleteExpense,
} = require("../controllers/expense")

// Categories Controllers Import
const {
  createCategory,
  showAllCategories
} = require("../controllers/category")


const { auth } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Expense routes
// ********************************************************************************************************

// create a new expense
router.post("/expenses", auth, createExpense)

// Get all expenses
router.get("/expenses", auth, getAllExpenses)

// update an expense
router.put("/expenses/:id", auth, editExpense)

// delete an expense
router.delete("/expenses/:id", auth, deleteExpense)


// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Create a new Category
router.post("/createCategory", createCategory)
// Get all Categories
router.get("/showAllCategories", showAllCategories)

module.exports = router
