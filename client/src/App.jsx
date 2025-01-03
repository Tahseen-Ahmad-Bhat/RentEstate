import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import NotificationContainer from "./util/Notification";
import CreateListing from "./pages/CreateListing";
import Listings from "./pages/Listings";

import ListingItem from "./pages/ListingItem";
import UpdateListingItem from "./pages/UpdateListingItem";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listingItem/:id" element={<ListingItem />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/listings" element={<Listings />} />
          <Route
            path="/update-listing/:listingItemId"
            element={<UpdateListingItem />}
          />
        </Route>
      </Routes>

      {/* Component for update notification */}
      <NotificationContainer />
    </BrowserRouter>
  );
};

export default App;
