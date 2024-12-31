import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notify } from "../util/Notification";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

const ListingItem = () => {
  SwiperCore.use([Navigation]);
  const [listingItem, setListingItem] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListingItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListingItem/${params.id}`);

        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return notify("error", data.message);
        }

        setListingItem({ ...data });
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListingItem();
  }, [params.id]);

  return (
    <main>
      {loading && (
        <p className="flex items-center justify-center">
          <AiOutlineLoading3Quarters className="my-24 text-5xl animate-spin" />
        </p>
      )}
      {error && (
        <p className="flex items-center justify-center text-4xl my-20">
          Something went wrong!
        </p>
      )}

      {listingItem && !loading && !error && (
        <>
          <Swiper navigation>
            {listingItem.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[350px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] bg-slate-100 z-10 rounded-md p-2">
              Link Copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto space-y-5 mt-5 p-8">
            <p className="text-3xl font-bold">
              {listingItem.name} - ${" "}
              {listingItem.offer
                ? listingItem.discountPrice
                : listingItem.regularPrice}{" "}
              {listingItem.type === "rent" && "/month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-sm text-slate-600">
              <FaMapMarkerAlt className="text-green-700" />{" "}
              {listingItem.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listingItem.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listingItem.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listingItem.regularPrice - +listingItem.discountPrice}{" "}
                  Discount
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listingItem.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-3 whitespace-nowrap">
                <FaBed size={20} />
                {listingItem.bedrooms > 1
                  ? `${listingItem.bedrooms} beds`
                  : `${listingItem.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-3 whitespace-nowrap">
                <FaBath size={20} />
                {listingItem.bathrooms > 1
                  ? `${listingItem.bathrooms} beds`
                  : `${listingItem.bathrooms} bed`}
              </li>
              <li className="flex items-center gap-3 whitespace-nowrap">
                <FaParking size={20} />
                {listingItem.parking ? `Parking spot` : `No Parking`}
              </li>
              <li className="flex items-center gap-3 whitespace-nowrap">
                <FaChair size={20} />
                {listingItem.furnished ? `Furnished` : `Unfurnished`}
              </li>
            </ul>
          </div>
        </>
      )}
    </main>
  );
};

export default ListingItem;
