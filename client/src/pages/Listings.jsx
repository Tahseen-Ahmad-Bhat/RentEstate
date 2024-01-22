import React, { useEffect, useState } from "react";
import { notify } from "../util/Notification";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Listings = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);

      setListings([...data]);
    } catch (error) {
      notify("error", error.message);
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="space-y-4 mt-8 mb-12 md:max-w-3xl md:mx-auto mx-20 flex flex-col">
      <p className="self-center text-2xl font-bold mb-5">Your Listings</p>
      {listings.length > 0 ? (
        listings.map((item) => (
          <div
            key={item._id}
            className="flex space-x-6 w-full items-center justify-between border p-5 rounded-lg shadow-md"
          >
            <Link
              to={`/listing/${item._id}`}
              className="flex items-center justify-between flex-1 space-x-4"
            >
              <img
                className="w-16 h-16 object-cover"
                src={item.imageUrls[0]}
                alt={item.name}
              />

              <p className="flex-1 text-slate-700 font-semibold truncate">
                {item.name}
              </p>
            </Link>
            <div className="flex flex-col items-center">
              <button type="button" className="text-red-700 uppercase">
                Delete
              </button>
              <button type="button" className="text-green-700 uppercase">
                View
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>You have not created any listing items yet!</p>
      )}
    </div>
  );
};

export default Listings;
