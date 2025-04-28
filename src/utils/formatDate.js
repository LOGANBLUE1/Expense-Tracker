export const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  const options = { year: "numeric", month: "long", day: "numeric" }
  const formattedDate = date.toLocaleDateString("en-US", options)

  let hour = date.getHours()
  const minutes = date.getMinutes()
  const period = hour >= 12 ? "PM" : "AM"

  hour = hour%12 === 0 ? 12 : hour%12;

  const formattedTime = `${hour}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`

  return `${formattedDate} | ${formattedTime}`
}

//      2024-08-13T05:49:03.073Z  ----->   August 13, 2024 | 11:19 AM