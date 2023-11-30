import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="mt-2 p-3 max-w-lg  mx-auto">
      <h1 className="text-3xl text-slate-900 font-semibold text-center">
        Sign Up
      </h1>
      <form className="flex flex-col space-y-5 mt-8">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border outline-none  p-3 rounded-lg"
        />
        <input
          type="email"
          name=""
          id="email"
          placeholder="Email"
          className="border outline-none p-3 rounded-lg"
        />
        <input
          type="password"
          name=""
          id="password"
          placeholder="Password"
          className="border outline-none p-3 rounded-lg"
        />
        <button
          type="submit"
          className="bg-slate-700 p-3 text-white rounded-lg hover:bg-slate-800 disabled:opacity-80"
        >
          SIGN UP
        </button>
      </form>

      <p className="mt-5">
        Already have an account?{" "}
        <Link to="/sign-in">
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
