import CTAButton from "../components/core/HomePage/Button";
function Error() {
  return (
    <div className="flex flex-col gap-10 flex-1 justify-center items-center text-white text-3xl">
      Error 404 - Page Not Found
        <CTAButton linkto={"/"}>
          Go to Homepage
        </CTAButton>

    </div>
  );
}

export default Error;