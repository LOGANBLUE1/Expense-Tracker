import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { FiEdit2 } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"

import IconBtn from "../../../Common/IconBtn"
import { getAllExpenses, deleteExpense } from "../../../../services/operations/expensesAPI"
import ConfirmationModal from "../../../Common/ConfirmationModal"
import { formatDate } from "../../../../utils/formatDate"
import { setExpense, setEditExpense } from "../../../../slices/expenseSlice"

export default function MyExpenses() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    const fetchExpenses = async () => {
      const result = await getAllExpenses(token);
      // console.log("Expenses : ",result)
      if (result) {
        setExpenses(result)
      }
    }
    fetchExpenses()
  }, [])

  const TRUNCATE_LENGTH = 30
  const handleExpenseDelete = async (expenseId) => {
    setLoading(true)
    await deleteExpense(expenseId, token)
    const result = await getAllExpenses(token)
    if (result) {
      setExpenses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  const handleEdit = (expense) => {
    dispatch(setEditExpense(true))
    dispatch(setExpense(expense))
    navigate(`/dashboard/edit-expense/${expense._id}`)
  }

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className={`text-3xl font-medium text-richblack-5`}>My Expenses</h1>
        <IconBtn
          text="Add Expense"
          onclick={() => navigate("/dashboard/add-expenses")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {expenses && <Table className="rounded-xl border border-richblack-800 ">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Expenses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Category
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Amount
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {expenses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No expenses found
                {/* TODO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            expenses?.map((expense) => (
              <Tr
                key={expense._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-4">
                  <div className="flex flex-col justify-between">
                    <p className="text-xs text-richblack-300">
                      {expense?.expenseDescription && expense.expenseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? expense.expenseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : expense.expenseDescription}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {formatDate(expense?.createdAt)}
                    </p>
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  {expense?.category?.name}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{expense.amount}
                </Td>
                <Td className="text-sm font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => handleEdit(expense)}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this expense?",
                        text2:
                          "All the data related to this expense will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleExpenseDelete(expense._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}
