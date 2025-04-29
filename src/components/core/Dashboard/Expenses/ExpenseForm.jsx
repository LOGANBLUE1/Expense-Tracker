import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useSelector, useDispatch } from "react-redux"

import { createExpense, updateExpense } from "../../../../services/operations/expensesAPI"
import { getAllCategories } from "../../../../services/operations/expensesAPI"
import IconBtn from "../../../Common/IconBtn"
import { allowOnlyNumber } from "../../../../utils/utils"
import { setExpense, setEditExpense } from "../../../../slices/expenseSlice"

export default function ExpenseForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()
  
  const dispatch = useDispatch()
  const { expense, editExpense } = useSelector((state) => state.expense)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [expenseCategories, setExpenseCategories] = useState([])

  useEffect(() => {
    //self invoking async function
    (async () => {
      setLoading(true)
      const categories = await getAllCategories()
      if (categories.length > 0) {
        setExpenseCategories(categories)
      }
      setLoading(false)
    })();
    if (editExpense) {
      setValue("expenseShortDesc", expense.expenseDescription)
      setValue("expenseAmount", expense.amount)
      setValue("expenseCategory", expense.category._id)
    }
  }, [])// on first render set the values from the

  const isFormUpdated = () => {
    const currentValues = getValues()
    return  (
      currentValues.expenseShortDesc !== expense.expenseDescription ||
      currentValues.expenseAmount !== expense.amount ||
      currentValues.expenseCategory !== expense.category._id 
    )
  }

  //   handle next button click
  const onSubmit = async (data) => {
    if (editExpense) {
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        if (currentValues.expenseShortDesc !== expense.expenseDescription) {
          formData.append("expenseDescription", data.expenseShortDesc)
        }
        if (currentValues.expenseAmount !== expense.Amount) {
          formData.append("amount", data.expenseAmount)
        }
        if (currentValues.expenseCategory._id !== expense.category._id) {
          formData.append("category", data.expenseCategory)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        await updateExpense(formData, expense._id, token)
        setLoading(false)
        return
      } else {
        toast.error("No changes made")
      }
      dispatch(setExpense(expense))
      dispatch(setEditExpense(false))
      return
    }

    const formData = new FormData()
    formData.append("expenseDescription", data.expenseShortDesc)
    formData.append("amount", data.expenseAmount)
    formData.append("category", data.expenseCategory)

    setLoading(true)
    const result = await createExpense(formData, token)
    setLoading(false)
  }




  return (
    <form
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >

      {/* expense Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="expenseShortDesc">
          Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="expenseShortDesc"
          placeholder="Enter Description"
          {...register("expenseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.expenseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            expense Description is required
          </span>
        )}
      </div>


      {/* expense Amount */}
      <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="expenseAmount">
            Amount <sup className="text-pink-200">*</sup>
          </label>
          <div className="relative">
            <input
              id="expenseAmount"
              placeholder="Enter expense Amount"
              {...register("expenseAmount", {
                required: true,
                valueAsNumber: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
              })}
              className="form-style w-full !pl-12"
              onKeyDown={allowOnlyNumber}
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
          </div>
          {errors.expenseAmount && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              expense Amount is required
            </span>
          )}
        </div>

      {/* expense Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="expenseCategory">
          Expense Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          id="expenseCategory"
          className="form-style w-full"
          {...register("expenseCategory", { required: true })}
        >
          <option value="" disabled selected>
            Choose a Category
          </option>
          {!loading &&
            expenseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>

        {errors.expenseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            expense Category is required
          </span>
        )}
      </div>


      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        <IconBtn 
          disabled={loading}
          text={!editExpense ? "Create" : "Save Changes"}
          onclick={handleSubmit(onSubmit)}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}
