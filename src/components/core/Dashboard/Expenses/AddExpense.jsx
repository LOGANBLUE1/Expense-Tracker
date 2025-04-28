import ExpenseForm from "./ExpenseForm"

export default function AddExpense() {
  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Create New Expense
      </h1>
      <div className="mx-auto max-w-[600px]">
        <ExpenseForm />
      </div>
    </>
  )
}
