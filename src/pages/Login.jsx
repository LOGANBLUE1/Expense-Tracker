import Template from "../components/core/Auth/Template"
import LoginForm from "../components/core/Auth/LoginForm"

function Login() {
  return (
    <Template
      title="Welcome to Expense Tracker"
      description1="Track your expenses effortlessly."
      description2="Manage your finances with ease."
    >
      <LoginForm />
    </Template>
  )
}

export default Login
