import React, { useEffect, useState } from "react";
import { notify } from "../util/Notification";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Listings = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userListings, setUserListings] = useState([]);

  const fetchListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);

      const data = await res.json();

      if (data.success === false) {
        notify("error", data.message);
        return;
      }

      setUserListings([...data]);
    } catch (error) {
      notify("error", error.message);
    }
  };

  const handleDeleteListingItem = async (id) => {
    const ans = confirm("Do you really want to delete the Item?");

    if (ans === false) return;

    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        notify("error", data.message);
        return;
      }

      const newUserListings = userListings.filter((item) => item._id !== id);
      setUserListings([...newUserListings]);

      notify("success", data.message);
    } catch (error) {
      notify("error", error.message);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="space-y-4 mt-8 mb-12 md:max-w-3xl md:mx-auto mx-20 flex flex-col">
      <p className="self-center text-3xl font-bold mb-5">Your Listings</p>
      {userListings.length > 0 ? (
        userListings.map((item) => (
          <div
            key={item._id}
            className="flex space-x-6 w-full items-center justify-between border p-5 rounded-lg shadow-md hover:scale-105 transition-all duration-500"
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
              <button
                onClick={() => handleDeleteListingItem(item._id)}
                type="button"
                className="text-red-700 uppercase px-4 py-2 rounded-lg hover:bg-slate-300"
              >
                Delete
              </button>
              <button
                type="button"
                className="text-green-700 uppercase px-4 py-2 rounded-lg hover:bg-slate-300"
              >
                Edit
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-2xl sm:text-4xl text-center flex flex-col gap-4 items-center justify-center">
          {" "}
          <span>Oops!🙃🙃</span>
          You have not created any listing items yet!
        </p>
      )}
    </div>
  );
};

export default Listings;
