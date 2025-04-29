import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import Chart from "./Chart"
import { getAllExpenses } from "../../../../services/operations/expensesAPI"
import { userDashboard } from "../../../../services/operations/profileAPI"

export default function User() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState([])
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const usrData = await userDashboard(token)
      const result = await getAllExpenses(token)
      if(usrData?.data?.length) setUserData(usrData)
      if (result) {
        setExpenses(result?.allexpenses)
        setTotal(result?.totalAmount)
        // console.log("Expenses: ", result)
      }
      setLoading(false)
    })()
  }, [])

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : (expenses && expenses?.length) > 0 ? (
        <div>
          <div className="my-4 flex h-[500px] space-x-4">
            {/* Render chart / graph */}
            {total > 0 ? (
              <Chart categories={userData}/>
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            
            {/* Total Statistics */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Expenses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {expenses.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Categories</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {userData?.data.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Expense Total</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {total}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 expenses */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Expenses</p>
              <Link to="/dashboard/my-expenses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {expenses && expenses?.slice(0, 3).map((expense) => (
                <div key={expense._id} className="w-1/3">
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {expense.expenseDescription}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {expense.category.name}
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {expense.amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any expenses yet
          </p>
          <Link to="/dashboard/add-expenses">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a expense
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}