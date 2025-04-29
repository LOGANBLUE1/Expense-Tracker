import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function Charts({ categories }) {
  console.log("Categories: ", categories)
  const [currChart, setCurrChart] = useState("category")

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: categories.map((category) => category.categoryName),
    datasets: [
      {
        data: categories.map((category) => category.totalAmount),
        backgroundColor: generateRandomColors(categories.length),
      },
    ],
  }

  // Data for the chart displaying timeframe information
  // const chartIncomeData = {
  //   labels: categories.map((course) => course.name),
  //   datasets: [
  //     {
  //       data: categories.map((course) => course.totalAmountGenerated),
  //       backgroundColor: generateRandomColors(categories.length),
  //     },
  //   ],
  // }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "category" chart */}
        <button
          onClick={() => setCurrChart("category")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "category"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "timeframe" chart */}
        <button
          onClick={() => setCurrChart("timeframe")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "timeframe"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Timeframe
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full overflow-hidden">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={
            // currChart === "category" ? 
            chartDataStudents
            //  : chartIncomeData
            }
          options={options}
        />
      </div>
    </div>
  )
}