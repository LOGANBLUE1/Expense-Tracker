import { toast } from "react-hot-toast"
export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    // Remove Content-Type if bodyData is FormData, let fetch handle it
    if (bodyData instanceof FormData) {
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = 'application/json';
    }
    
    const options = {
      method: method.toUpperCase(),
      headers: headers,
    };

    console.log("API Request:", method, url, bodyData);

    // Set the body to bodyData (either FormData or JSON string)
    if (bodyData) {
      options.body = bodyData instanceof FormData ? bodyData : JSON.stringify(bodyData);
    }

    // Handle query parameters
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    url += queryString;

    // Make the fetch request
    const response = await fetch(process.env.REACT_APP_BASE_URL + url, options);

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      data.status = response.status;

      console.log("RES:",url,method,data)
      // console.log("Resonse :", data)
      if(!response.ok) {
        if (response.status === 500)
          data.message = "Server is down, please try again later";
        toast.error(data?.message || "API response is not OK");
      }
    } else {
      const text = await response.text();
      throw new Error(`Unexpected content-type: ${contentType}, Response: ${text}`);
    }
    return data;
  } catch (error) {
    console.error("API Connector Error:", error);
    return {
      success: false,
      message: 'API Connector throwing Error',
      status: null,
    };
  }
};
