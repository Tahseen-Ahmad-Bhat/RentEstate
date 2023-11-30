import React from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Rent</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center justify-evenly">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-24 sm:w-64"
          />
          <MdSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="text-slate-700 hidden sm:inline-block hover:text-slate-500 hover:cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-700 hidden sm:inline-block hover:text-slate-500 hover:cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className="text-slate-700 hover:text-slate-500 hover:cursor-pointer">
              Sign In
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
