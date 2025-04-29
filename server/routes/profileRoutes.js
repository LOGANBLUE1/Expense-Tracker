const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const {
  deleteAccount,
  updateProfile,
  getCompleteUserDetails,
  instructorDashboard
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getCompleteUserDetails)

router.get("/instructorDashboard", auth, instructorDashboard)

module.exports = router
