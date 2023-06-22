import { Formik, useFormik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import db from "../../firebase";

const LodgeComplaint = ({ handleCloseModal }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentYear: "",
      phone: "",
      matricNo: "",
      reportTo: "",
      title: "",
      description: "",
    },
    validationSchema: yup.object({
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      studentYear: yup.string().required("Student Year is required"),
      phone: yup.string().required("Phone Number is required"),
      matricNo: yup.string().required("Matriculation Number is required"),
      title: yup.string().required("Title is required"),
      reportTo: yup.string().required("Report To is required"),
      description: yup.string().required("Complaint Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        values.dateCreated = new Date().toISOString().split("T")[0]; // Set the current date as the dateCreated
        values.status = "In Progress";
        await db.collection("complaints").add(values);
        console.log("Form data submitted successfully!");
        setIsSubmitted(true);
        resetForm();
      } catch (error) {
        console.error("Error submitting form data:", error);
      }
    },
  });
  const selectStyle = {
    backgroundImage: "url('/assets/icon/carret-down.svg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1.5rem top 50%",
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 w-full mx-auto">
      {isSubmitted ? (
        <div className="fixed inset-0 bg-black opacity-50"></div>
      ) : null}
      <div className="relative w-full max-w-[550px] bg-white rounded-lg shadow-lg overflow-y-auto ">
        {isSubmitted ? (
          <div className="flex flex-col gap-8 px-4 py-8 justify-center self-center text-center sm:mt-4 sm:text-left">
            <h3
              className="text-black text-center text-base md:text-2xl font-bold"
              id="modal-headline"
            >
              Complaint Submitted Successfully!
            </h3>
            <p className="text-gray-600">
              Thank you for submitting your complaint. We will review it
              shortly.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-oou-purple text-white py-2 px-4 rounded-lg mt-4"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative w-full max-w-[550px] bg-white rounded-lg shadow-lg overflow-y-auto ">
              <span
                className="hidden md:flex absolute top-0 right-0 m-4 text-gray-500 cursor-pointer"
                onClick={handleCloseModal}
              >
                &times;
              </span>
              <div className=" flex flex-col gap-8 px-4 py-8 justify-center self-center text-center sm:mt-4 sm:text-left">
                <h3
                  className="text-black text-center text-base md:text-2xl font-bold"
                  id="modal-headline"
                >
                  Lodge a complaint
                </h3>
              </div>
              <Formik {...formik}>
                <form
                  className="flex flex-col gap-4  w-full p-4 "
                  onSubmit={formik.handleSubmit}
                >
                  <div className="flex text-left flex-row flex-wrap gap-2 justify-between">
                    <label className="w-full max-w-[230px] gap-2  text-sm font-medium flex flex-col ">
                      First Name
                      <input
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        autoComplete="given-name"
                        type="text"
                        placeholder="Enter First Name"
                        name="firstName"
                        {...formik.getFieldProps("firstName")}
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div className="text-red-500">
                          {formik.errors.firstName}
                        </div>
                      ) : null}
                    </label>
                    <label className="w-full max-w-[230px] gap-2  text-sm font-medium flex flex-col ">
                      Last Name
                      <input
                        autoComplete="family-name"
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="text"
                        placeholder="Enter Last Name"
                        name="lastName"
                        {...formik.getFieldProps("lastName")}
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div className="text-red-500">
                          {formik.errors.lastName}
                        </div>
                      ) : null}
                    </label>
                  </div>
                  <div className="flex text-left flex-row flex-wrap gap-2 justify-between">
                    <label className="w-full max-w-[230px] gap-2  text-sm font-medium flex flex-col ">
                      Email Address
                      <input
                        autoComplete="email"
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="text"
                        placeholder="Enter Email Address"
                        name="email"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </label>
                    <label className="w-full max-w-[230px] gap-2  text-sm font-medium flex flex-col ">
                      Student Year
                      <input
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="text"
                        placeholder="Enter your current Level "
                        name="studentYear"
                        {...formik.getFieldProps("studentYear")}
                      />
                      {formik.touched.studentYear &&
                      formik.errors.studentYear ? (
                        <div className="text-red-500">
                          {formik.errors.studentYear}
                        </div>
                      ) : null}
                    </label>
                  </div>

                  <div className="flex text-left flex-row flex-wrap gap-2 justify-between">
                    <label className="w-full max-w-[230px] gap-2  text-sm font-medium flex flex-col ">
                      Phone Number
                      <input
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="tel"
                        placeholder="Enter your Phone Number"
                        name="phone"
                        {...formik.getFieldProps("phone")}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-red-500">
                          {formik.errors.phone}
                        </div>
                      ) : null}
                    </label>
                    <label className="w-full max-w-[230px] gap-2  text-sm font-medium flex flex-col ">
                      Matriculation Number
                      <input
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="text"
                        placeholder="Enter your Matric Nuber "
                        name="matricNo"
                        {...formik.getFieldProps("matricNo")}
                      />
                      {formik.touched.matricNo && formik.errors.matricNo ? (
                        <div className="text-red-500">
                          {formik.errors.matricNo}
                        </div>
                      ) : null}
                    </label>
                  </div>
                  <div className="flex text-left flex-row flex-wrap gap-2 justify-between">
                    <label className="w-full max-w-[380px] gap-2  text-sm font-medium flex flex-col ">
                      Complaint Title
                      <input
                        className="  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="text"
                        placeholder="Whats the title of your commplaint? "
                        name="title"
                        {...formik.getFieldProps("title")}
                      />
                      {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500">
                          {formik.errors.title}
                        </div>
                      ) : null}
                    </label>
                    <label className="w-full max-w-[100px] gap-2  text-sm font-medium flex flex-col">
                      Report To
                      <select
                        className={`text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg ${
                          formik.touched.reportTo && formik.errors.reportTo
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        name="reportTo"
                        id="reportTo"
                        style={selectStyle}
                        {...formik.getFieldProps("reportTo")}
                      >
                        <option value="">Select</option>
                        <option value="Mr_A">Mr A</option>
                        <option value="Mr_B">Mr B</option>
                        <option value="Mr_C">Mr C</option>
                        <option value="Mr_D">Mr D</option>
                        <option value="Mr_E">Mr E</option>
                      </select>
                      {formik.touched.reportTo && formik.errors.reportTo && (
                        <div className="text-red-500 text-[12px] ">
                          {formik.errors.reportTo}
                        </div>
                      )}
                    </label>
                  </div>
                  <div className="flex text-left flex-row flex-wrap gap-2 justify-center w-full">
                    <label className="w-full max-w-full gap-2  text-sm font-medium flex flex-col ">
                      Complaint Description
                      <textarea
                        className="h-[100px]  text-sm font-normal py-3   px-2  border border-solid border-oou-purple rounded-lg "
                        type="text"
                        placeholder="Describe your complaint below? "
                        name="description"
                        {...formik.getFieldProps("description")}
                      />
                      {formik.touched.description &&
                      formik.errors.description ? (
                        <div className="text-red-500">
                          {formik.errors.description}
                        </div>
                      ) : null}
                    </label>
                  </div>

                  {/* Submit and Back Button */}
                  <div className=" flex gap-4 justify-center">
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#130FC2",
                        color: "#fff",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Submit
                    </button>
                    <span
                      style={{
                        backgroundColor: "red",
                        color: "#fff",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.25rem",
                        transition: "all 0.3s ease",
                      }}
                      onClick={handleCloseModal}
                    >
                      Close{" "}
                    </span>
                  </div>
                </form>
              </Formik>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LodgeComplaint;
