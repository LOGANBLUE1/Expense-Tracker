import { useEffect } from "react"
import "./App.css"
// Redux
import { useSelector, useDispatch } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"

// Components
import Navbar from "./components/Common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Error from "./pages/Error"
import ForgotPassword from "./pages/ForgotPassword"
// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import AddExpense from "./components/core/Dashboard/Expenses/AddExpense"
import Settings from "./components/core/Dashboard/Settings"
import MyProfile from "./components/core/Dashboard/MyProfile"
import VerifyEmail from "./pages/VerifyEmail"
import Dashboard from "./pages/Dashboard"
import { getUserDetails } from "./services/operations/profileAPI"
import MyExpenses from "./components/core/Dashboard/Expenses/MyExpenses"
import EditExpense from "./components/core/Dashboard/Expenses/EditExpense"
import User from "./components/core/Dashboard/User"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {token} = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`flex min-h-screen w-screen flex-col bg-richblack-900 font-inter`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route path="/login" element={<OpenRoute> <Login /> </OpenRoute>} />
        <Route path="forgot-password" element={<OpenRoute> <ForgotPassword /> </OpenRoute>} />
        <Route path="update-password/:id" element={<OpenRoute><UpdatePassword /></OpenRoute>}/>
        <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path="verify-email" element={<OpenRoute><VerifyEmail /></OpenRoute>} />


        <Route  path="dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>}>
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="my-expenses" element={<MyExpenses/>} />
          <Route path="add-expenses" element={<AddExpense/>} />
          <Route path="edit-expense/:expenseId" element={<EditExpense />} />
          <Route path="visualize" element={<User/>} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
