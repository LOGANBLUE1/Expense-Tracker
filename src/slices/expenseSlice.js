import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  expense: null,
  editExpense: false
}

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    setExpense: (state, action) => {
      state.expense = action.payload
    },
    setEditExpense: (state, action) => {
      state.editExpense = action.payload
    },
    resetExpenseState: (state) => {
      state.expense = null
      state.editExpense = false
    },
  },
})

export const {
  setExpense,
  setEditExpense,
  resetExpenseState,
} = expenseSlice.actions

export default expenseSlice.reducer
