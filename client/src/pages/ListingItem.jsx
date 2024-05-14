import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { notify } from "../util/Notification";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ListingItem = () => {
  SwiperCore.use([Navigation]);
  const [listingItem, setListingItem] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListingItem = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListingItem/${params.id}`);

        const data = await res.json();

        console.log(data);

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
        </>
      )}
    </main>
  );
};

export default ListingItem;
