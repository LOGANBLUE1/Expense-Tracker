export const endpoints = {
  SENDOTP_API: "/auth/sendotp",
  SIGNUP_API: "/auth/signup",
  LOGIN_API: "/auth/login",
  GOOGLE_LOGIN_API: "/auth/google",
  RESETPASSTOKEN_API: "/auth/reset-password-token",
  RESETPASSWORD_API: "/auth/reset-password",
  CHANGE_PASSWORD_API: "/auth/changepassword"
}

// EXPENSES ENDPOINTS
export const expensesEndpoints = {
  EXPENSE_API: "/expense/expenses"
}

// CATAGORIES API
export const categoryEndpoints = {
  GET_CATEGORIES_API: "/expense/showAllCategories"
}


// PROFILE ENDPOINTS
export const profileEndpoints = {
  DELETE_PROFILE_API: "/profile/deleteProfile",
  UPDATE_PROFILE_API: "/profile/updateProfile",
  GET_USER_DETAILS_API: "/profile/getUserDetails",
  GET_USER_DATA_API: "/profile/userDashboard"
}