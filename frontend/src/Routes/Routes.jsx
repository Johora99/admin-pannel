import React from "react";
import { createBrowserRouter } from "react-router-dom"; 
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AdminUsers from "../Pages/AdminUsers";
import Layout from "../Layout/Layout";
import PrivateRoute from "../PrivateRoute/PrivateRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: <PrivateRoute />, 
    children: [
      {
        index: true,
        element: <AdminUsers />,
      },
    ],
  },
]);
