import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { auth } from "../firebase";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required").email(),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, event) => {
      try {
        setIsLoading(true);
        const { email, password } = values;

        // Add your admin authentication logic here
        // You can use the same signInWithEmailAndPassword method as the student login,
        // but perform additional checks to verify if the user is an admin

        await auth.signInWithEmailAndPassword(email, password);

        const user = auth.currentUser;

        if (user) {
          const admins = [
            "admin1@example.com",
            "admin2@example.com",
            "admin3@example.com",
          ]; // Replace with your list of assigned admin emails

          if (admins.includes(user.email)) {
            navigate("/admin"); // Redirect to the admin page
          } else {
            setLoginError("You are not authorized to access the admin panel");
          }
        }
      } catch (error) {
        console.error(error);
        if (error.code === "auth/wrong-password") {
          setLoginError("Incorrect password");
        } else {
          setLoginError(
            "An error occurred while signing in. Please try again later."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col gap-4 w-full max-w-sm rounded-lg bg-white shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Admin Sign In</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 mt-1">{formik.errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 mt-1">{formik.errors.password}</p>
              )}
            </div>
            {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
