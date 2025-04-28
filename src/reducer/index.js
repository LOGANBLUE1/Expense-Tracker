import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import expenseReducer from "../slices/expenseSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  expense: expenseReducer
})

export default rootReducer
