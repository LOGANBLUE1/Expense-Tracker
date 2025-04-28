import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { categoryEndpoints, expensesEndpoints } from "../apis"
import { logout } from "./authAPI"
import { HTTP_METHODS } from "../../utils/constants"

const {
  EXPENSE_API
} = expensesEndpoints

const {
  GET_CATEGORIES_API,
  CREATE_CATEGORY_API
} = categoryEndpoints

export const createExpense = async (data, token) => {
  let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.POST, EXPENSE_API, data, {
        Authorization: `Bearer ${token}`,
      })
      // for (let [key, value] of data.entries()) {
      //   console.log("in additional: ",key, value);
      // }
      // console.log("EXPENSE_API RESPONSE............", response)

      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success("Expense Added Successfully")
      result = response?.data
    } catch (error) {
      console.log("EXPENSE_API ERROR............", error)
      toast.error("Could Not Create Expense")
    } finally {
      toast.dismiss(toastId)
    }
    return result
}

export const updateExpense = async (data, expenseId, token) => {
  let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.PUT, EXPENSE_API + `/${expenseId}`, data, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("EXPENSE_API RESPONSE............", response)

      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success("Expense Added Successfully")
      result = response?.data
    } catch (error) {
      console.log("EXPENSE_API ERROR............", error)
      toast.error("Could Not Update Expense")
    } finally {
      toast.dismiss(toastId)
    }
    return result
}

export const getAllExpenses = async(token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.GET, EXPENSE_API, null, {
        Authorization: `Bearer ${token}`,
      })

      result = response?.data
      // console.log("EXPENSE_API RESPONSE............", response)
    } catch (error) {
      console.log("EXPENSE_API ERROR............", error)
      toast.error("Could Not Get Expense Details")
    } finally {
      toast.dismiss(toastId)
    }
    return result
}


export const deleteExpense = async (expenseId, token) => {
    const toastId = toast.loading("Loading...")
    try {
      console.log("ExpenseId URL: ", expenseId)
      const response = await apiConnector(HTTP_METHODS.DELETE, EXPENSE_API + `/${expenseId}`, null, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("EXPENSE_API RESPONSE............", response)

      if (!response.success) {
        throw new Error(response.message)
      }
      toast.success("Expense Deleted Successfully")
    } catch (error) {
      console.log("EXPENSE_API ERROR............", error)
      toast.error("Could Not Delete Expense")
    } finally {
      toast.dismiss(toastId)
    }
}


export const getAllCategories = async () => {
  let result = null;
  try {
    const response = await apiConnector(HTTP_METHODS.GET, GET_CATEGORIES_API)
    if (!response?.success) {
      throw new Error("Could Not get All categories data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATEGORIES_API API ERROR............", error)
    toast.error(error.message)
    result = error.response
  }
  return result
}
