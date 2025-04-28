import { AiOutlineMenu } from "react-icons/ai"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"
import { NavbarLinks } from "../../data/navbar-links"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

function Navbar() {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth)// if logged in

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700
       transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">

        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className={`flex gap-x-6 text-richblack-800`}>
            {
              NavbarLinks.map((link, index) => (
                <li key={index}>
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? `text-yellow-100`
                            : `text-richblack-25`
                        } hover:text-yellow-25`}
                      >
                        {link.title}
                      </p>
                    </Link>
                </li>
              ))
            }
          </ul>
        </nav>


        {/* Login / Signup / Dashboard */}
        <div className=" items-center gap-x-4 md:flex">
          {!token && (
            <Link to="/login">
              <button className={`rounded-[8px] border bg-richblack-800 hover:text-yellow-25 px-[12px] py-[8px] text-richblack-100 border-richblack-100 ${matchRoute("/login") ? `text-yellow-100` : ``}`}>
                Log in
              </button>
            </Link>
          )}
          {!token && (
            <Link to="/signup">
              <button className={`rounded-[8px] border bg-richblack-800 hover:text-yellow-25 px-[12px] py-[8px] text-richblack-100 border-richblack-100 ${matchRoute("/signup") ? "text-yellow-100" : ``}`}>
                Sign up
              </button>
            </Link>
          )}

          {token && <ProfileDropdown />}

        </div>
        {/* TODO: Show login and pass */}
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  )
}

export default Navbar
