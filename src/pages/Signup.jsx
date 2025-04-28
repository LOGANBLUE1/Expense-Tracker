import Template from "../components/core/Auth/Template"
import { useLocation } from "react-router-dom";
import SignupForm from "../components/core/Auth/SignupForm"

function Signup() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userType = queryParams.get("user");
  return (
    <Template
      title="Welcome to Expense Tracker"
      description1="Track your expenses effortlessly."
      description2="Manage your finances with ease."
    >
      <SignupForm userType={userType} />
    </Template>
  )
}

export default Signup
