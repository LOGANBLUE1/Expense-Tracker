const Expense = require("../models/Expense")
const Category = require("../models/Category")
const User = require("../models/User")


// Function to create a new expense
exports.createExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    let { expenseDescription, amount, category } = req.body

    // Check if any of the required fields are missing
    if (!expenseDescription || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    
    const userDetails = await User.findById(userId)
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Details Not Found",
      })
    }

    // Create a new expense with the given details
    const newExpense = await Expense.create({
      expenseDescription,
      user: userDetails._id,
      amount,
      category
    })

    // Add the new expense to the Schema of User
    await User.findByIdAndUpdate(
      {
        _id: userDetails._id,
      },
      {
        $push: {
          expenses: newExpense._id,
        },
      },
      { new: true }
    )

    // Return the new expense and a success message
    res.status(200).json({
      success: true,
      data: newExpense,
      message: "Expense Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the expense
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create expense",
      error: error.message,
    })
  }
}



// Edit expense Details
exports.editExpense = async (req, res) => {
  try {
    const { id } = req.params; 
    const updates = req.body
    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: "expense not found"
      })
    }

    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        expense[key] = updates[key]
      }
    }

    await expense.save()

    const updatedexpense = await Expense.findOne({
      _id: id,
    })
      .populate({
        path: "user",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .exec()

    res.json({
      success: true,
      message: "expense updated successfully",
      data: updatedexpense,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get expense List
exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id
  try {
    const allexpenses = await Expense.find(
      { user: userId },
      {
        expenseDescription: true,
        amount: true,
        user: true,
        category: true,
        createdAt: true
      }
    )
    .populate("category")
    .exec()

    const totalAmount = allexpenses.reduce((acc, expense) => acc + expense.amount, 0)

    return res.status(200).json({
      success: true,
      data: {
        allexpenses, 
        totalAmount
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch expense Data`,
      error: error.message,
    })
  }
}

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params; 
    const expense = await Expense.findById(id);
    if(!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }
    await Expense.findByIdAndDelete(id);
    await User.findByIdAndUpdate(
      expense.user,
      {
        $pull: {
          expenses: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};
