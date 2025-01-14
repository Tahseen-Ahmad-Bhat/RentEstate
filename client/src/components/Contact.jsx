import React, { useEffect, useState } from "react";
import { notify } from "../util/Notification";
import { Link } from "react-router-dom";

const Contact = ({ listingItem }) => {
  console.log(listingItem);
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const fetchLandlord = async () => {
    const res = await fetch(`/api/user/${listingItem.userRef}`);
    const data = await res.json();

    if (data.success === false) {
      return notify("error", data.message);
    }

    setLandlord({ ...data });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    fetchLandlord();
  }, [listingItem.userRef]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <p>
          Contact <span className="font-semibold">{landlord?.username}</span>{" "}
          for{" "}
          <span className="font-semibold">
            {listingItem.name.toLowerCase()}
          </span>
        </p>
        <textarea
          name="message"
          id="message"
          value={message}
          placeholder="Enter your message here..."
          className="w-full rounded-lg p-3 border"
          rows="2"
          onChange={(e) => handleMessageChange(e)}
        ></textarea>
        <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listingItem.name}&body=${message}`}
          className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
        >
          Send Message
        </Link>
      </div>
    </>
  );
};

export default Contact;
