const mongoose = require("mongoose");
const Profile = require("../models/Profile")

const Expense = require("../models/Expense")
const User = require("../models/User")

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    const id = req.user.id;

    // Find the user by id
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the profile associated with the user
    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user",
      });
    }

    if (firstName !== undefined) userDetails.firstName = firstName;
    if (lastName !== undefined) userDetails.lastName = lastName;

    await userDetails.save();

    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
    if (about !== undefined) profile.about = about;
    if (contactNumber !== undefined) profile.contactNumber = contactNumber;
    if (gender !== undefined) profile.gender = gender;
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    // console.log("Printing id to be deleted: ",id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // makes user inactive
    await user.save()

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ 
      success: false, 
      message: "User Cannot be deleted successfully" 
    })
  }
}

exports.getCompleteUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    // console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.userDashboard = async (req, res) => {
  try {
    const allExpenses = await Expense.find({ user: req.user.id }).populate("category").exec();

    const categoryMap = new Map();

    allExpenses.forEach((expense) => {
      const catId = expense.category._id.toString();
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, {
          categoryId: catId,
          categoryName: expense.category.name,
          totalAmount: 0
        });
      }
      categoryMap.get(catId).totalAmount += expense.amount;
    });

    const result = Array.from(categoryMap.values());


    const monthlyTotalsMap = new Map();
    allExpenses.forEach(exp => {
      const date = new Date(exp.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., "2025-04"

      if (!monthlyTotalsMap.has(monthKey)) {
        monthlyTotalsMap.set(monthKey, 0);
      }

      monthlyTotalsMap.set(monthKey, monthlyTotalsMap.get(monthKey) + exp.amount);
    });

    const monthlyTotals = Array.from(monthlyTotalsMap.entries()).map(([month, total]) => ({
      month,
      totalAmount: total
    }));


    res.status(200).json({ 
      success: true,
      data: result,
      data2: monthlyTotals
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}