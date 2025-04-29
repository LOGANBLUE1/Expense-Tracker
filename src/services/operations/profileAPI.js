import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"
import { HTTP_METHODS } from "../../utils/constants"

const {
  DELETE_PROFILE_API,
  UPDATE_PROFILE_API,
  GET_USER_DETAILS_API,
  UPDATE_DISPLAY_PICTURE_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        HTTP_METHODS.PUT,
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      // console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE............", response)

      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    } finally {
      toast.dismiss(toastId)
    }
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.PUT, UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("UPDATE_PROFILE_API RESPONSE............", response)

      if (!response.success) {
        toast.error(response.message)
        return
      }
      const userImage = response.data.image
        ? response.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.firstName} ${response.data.lastName}`
      dispatch(
        setUser({ ...response.data, image: userImage })
      )
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API ERROR............", error)
      toast.error("Could Not Update Profile")
    } finally {
      toast.dismiss(toastId)
    }
  }
}

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector(HTTP_METHODS.GET, GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("GET_USER_DETAILS RESPONSE............", response)

      if (!response.success) {
        throw new Error(response.message)
      }
      const userImage = response.data.image
        ?? `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.firstName} ${response.data.lastName}`
      dispatch(setUser({ ...response.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.DELETE, DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("DELETE_PROFILE_API RESPONSE............", response)

      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API ERROR............", error)
      toast.error("Could Not Delete Profile")
    } finally {
      toast.dismiss(toastId)
    }
  }
}


export const userDashboard = async(token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.GET, GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })

    result = response?.data
    // console.log("GET_INSTRUCTOR_DATA_API RESPONSE............", response)
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API ERROR............", error)
    toast.error("Could Not Get userDashboard Details")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}