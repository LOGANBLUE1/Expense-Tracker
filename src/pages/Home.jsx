// Icons Import
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
// Component Imports
import CTAButton from "../components/core/HomePage/Button"
import HighlightText from "../components/core/HomePage/HighlightText"

function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        <div className="text-center text-4xl font-semibold mt-16">
          Future of
          <HighlightText text={"Managing Expenses"} />
        </div>

        {/* Become a Instructor Button */}
        <Link to={`/signup`}>
          <div className="group mx-auto  w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an User</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}

        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With out took you can track your expenses, manage your budget
      
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>


      </div>

    </div>
  )
}

export default Home
