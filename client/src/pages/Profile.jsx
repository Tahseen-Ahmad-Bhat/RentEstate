import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { notify } from "../util/Notification";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../util/Validation";

// Function for user validation
const validateFormData = (formData) => {
  const { username, email, password } = formData;

  if (username && !validateName(username)) {
    notify("error", "Please enter a valid name!");
    return false;
  }
  if (email && !validateEmail(email)) {
    notify("error", "Please enter a valid email!");
    return false;
  }

  if (password && !validatePassword(password)) {
    notify("error", "Password has to be 5 to 15 characters long!");
    return false;
  }

  return true;
};

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user input
    if (!validateFormData(formData)) return;

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));

        // Notify user by notification
        notify("error", data.message);

        setProfileUpdateSuccess(false);
        return;
      }

      dispatch(updateUserSuccess(data));

      notify("success", "Profile updated successfully!");

      setProfileUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      notify("error", error.message);
    }
  };

  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        notify("error", data.message);
        return;
      }

      dispatch(deleteUserSuccess());
      notify("success", data.message);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      notify("error", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        notify("error", data.message);
        return;
      }

      dispatch(signOutUserSuccess());
      notify("success", data.message);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
      notify("error", error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-4">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          className="h-24 w-24 rounded-full object-fill self-center cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image upload error (image must be less than 2 mb)
            </span>
          ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadPercentage}%`}</span>
          ) : uploadPercentage === 100 ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="p-3 rounded-lg border"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="p-3 rounded-lg border"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="p-3 rounded-lg border"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex items-center justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          {" "}
          Sign out
        </span>
      </div>

      <p
        className="mt-5 text-green-600 flex items-center justify-center cursor-pointer hover:opacity-70"
        onClick={() => navigate("/listings")}
      >
        Show Listings
      </p>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {profileUpdateSuccess ? "Profile updated successfully!🥳🥳" : ""}
      </p>
    </div>
  );
};

export default Profile;
