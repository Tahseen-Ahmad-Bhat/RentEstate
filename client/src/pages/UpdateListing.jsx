import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase.js";
import { notify } from "../util/Notification.jsx";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const params = useParams();
  // console.log(params);
  const { listingItemId } = params;

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imagesUploadError, setImagesUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          setImagesUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          notify("error", "Image upload failed (2 mb max per image)!");
          setImagesUploadError("Image upload failed (2 mb max per image)!");
          setUploading(false);
        });
    } else {
      notify("error", "You can only upload 6 images per listing!");
      setImagesUploadError("You can only upload 6 images per listing!");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    console.log(formData);
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    console.log(formData);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
      });
    } else if (id === "furnished" || id === "parking" || id === "offer") {
      setFormData({
        ...formData,
        [id]: !formData[id],
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check for the image
      if (formData.imageUrls.length < 1) {
        setFormSubmitError("You must upload atleast one image!");
        notify("error", "Upload at least one image!");
        return;
      }

      // check discounted price is less than regular price
      if (formData.discountPrice >= formData.regularPrice) {
        setFormSubmitError(
          "Discounted price has to be less than regular price!"
        );
        notify("error", "Discounted price has to be less than regular price!");
        return;
      }

      setSubmittingForm(true);
      setFormSubmitError(false);

      const res = await fetch(`/api/listing/update/${listingItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();

      setSubmittingForm(false);

      if (data.success === false) {
        setFormSubmitError(data.error);
        notify("error", data.message);
        return;
      }

      notify("success", "Listing Item updated successfully!");

      console.log(data);
      navigate(`/listing/${data.updatedListingItem._id}`);
    } catch (error) {
      setFormSubmitError(error.message);
      setSubmittingForm(false);
      notify("error", error.message);
    }
  };

  useEffect(() => {
    const fetchListingItem = async () => {
      try {
        const res = await fetch(`/api/listing/getListingItem/${listingItemId}`);

        const data = await res.json();

        if (data.success === false) {
          notify("error", data.message);
          return;
        }

        setFormData(data);
      } catch (error) {
        notify("error", error.message);
      }
    };

    fetchListingItem();
  }, []);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleInputChange}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={formData.type === "sale"}
                onChange={handleInputChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={formData.type === "rent"}
                onChange={handleInputChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={handleInputChange}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleInputChange}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleInputChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="20"
                required
                className="p-3 border-gray-300 rounded-lg"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="20"
                required
                className="p-3 border-gray-300 rounded-lg"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border-gray-300 rounded-lg"
                value={formData.regularPrice}
                onChange={handleInputChange}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                {formData?.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData?.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border-gray-300 rounded-lg"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData?.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              className="p-3 border text-green-700 border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleImageUpload}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imagesUploadError && imagesUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, idx) => (
              <div
                className="flex justify-between p-3 border rounded-lg items-center"
                key={url}
              >
                <img
                  className="w-20 h-20 object-contain items-center rounded-lg"
                  src={url}
                  alt="listing image"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-red-700 p-3 uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            disabled={submittingForm || uploading}
          >
            {submittingForm ? "Updating..." : "Update Listing"}
          </button>
          {formSubmitError && (
            <p className="text-red-700 text-sm">{formSubmitError}</p>
          )}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
