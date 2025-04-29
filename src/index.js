import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { GoogleOAuthProvider } from "@react-oauth/google";

const store = configureStore({
  reducer: rootReducer,
});
const clientId = "455757362263-intk7c3aipgm7m95migdhkcbcc0de3eu.apps.googleusercontent.com"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
);
