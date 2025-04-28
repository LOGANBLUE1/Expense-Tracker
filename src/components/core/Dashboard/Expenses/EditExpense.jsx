import { useSelector } from "react-redux"
import ExpenseForm from "./ExpenseForm"

export default function EditExpense() {
  const { expense } = useSelector((state) => state.expense)
  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Expense
      </h1>
      <div className="mx-auto max-w-[600px]">
        {expense ? (
          <ExpenseForm/>
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Expense not found
          </p>
        )}
      </div>
    </div>
  )
}
