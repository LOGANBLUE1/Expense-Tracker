export default function GetAvgRating(ratingArr) {
  if (ratingArr?.length === 0) return 0
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating
    return acc
  }, 0)

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier

  return avgReviewCount
}

export const allowOnlyAlphabet = (e) => {
  if (!/[a-zA-Z]/.test(e.key)) {
    e.preventDefault();
  }
};

export const allowOnlyNumber = (e) => {
  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
    e.preventDefault();
  }
};