import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // console.log(formdata);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      setFormData({});
      console.log(data);

      // On successful sign-up navigate to sign-in page
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log(error.message);
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
