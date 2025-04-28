import google from "../../../assets/gogole.png";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../../services/operations/authAPI";
const GoogleAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (tokenResponse) => {
      dispatch(googleLogin(navigate, tokenResponse));
  };

  const login = useGoogleLogin({
    onSuccess: handleLogin,
    onError: () => console.log("Login Failed"),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="flex justify-center items-center mt-6 rounded-[8px] py-[8px] px-[12px] font-medium text-richblack-5 border border-richblack-500 hover:bg-richblack-700 transition-all duration-200"
    >
      <img src={google} alt="google logo" className="h-7 px-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;