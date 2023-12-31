import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import OAuth from "../components/OAuth";
import { notify } from "../util/Notification";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../util/Validation";

const initialFormData = {
  username: "",
  email: "",
  password: "",
};

// Function for user validation
const validateFormData = (formData) => {
  const { username, email, password } = formData;

  if (!validateName(username)) {
    notify("error", "Please enter a valid name!");
    return false;
  }
  if (!validateEmail(email)) {
    notify("error", "Please enter a valid email!");
    return false;
  }

  if (!validatePassword(password)) {
    notify("error", "Password has to be 5-15 characters long!");
    return false;
  }

  return true;
};

const SignUp = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user input
    if (!validateFormData(formData)) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        notify("error", data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      setFormData(initialFormData);

      notify("success", data.message);

      // On successful sign-up navigate to sign-in page
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
      notify("error", error.message);
    }
  };

  return (
    <div className="mt-2 p-3 max-w-lg  mx-auto">
      <h1 className="text-3xl text-slate-900 font-semibold text-center">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5 mt-8">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border outline-none  p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          name=""
          id="email"
          placeholder="Email"
          className="border outline-none p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          name=""
          id="password"
          placeholder="Password"
          className="border outline-none p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 p-3 text-white rounded-lg hover:bg-slate-800 disabled:opacity-80 flex items-center justify-center"
        >
          {loading ? (
            <ImSpinner3 className="animate-spin " size="24" />
          ) : (
            "SIGN UP"
          )}
        </button>

        <OAuth />
      </form>

      <p className="mt-5">
        Already have an account?{" "}
        <Link to="/sign-in">
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </p>

      {/* Rendet error if there is any */}
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
};

export default SignUp;
