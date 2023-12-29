import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Market from "../pages/Market";
import Create from "../pages/Create";
import Contact from "../pages/Contact";
import Wallet from "../pages/Wallet";
import NftDetails from "../pages/NftDetails";
import { CustomSwitch } from "./CustomSwitch";
import Profile from "../pages/Profile";
// import Login from "../pages/Login";
const Routers = () => {
  return (
    <CustomSwitch>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/market" element={<Market />} />
      <Route path="/create" element={<Create />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/market/:id" element={<NftDetails />} />
    </CustomSwitch>
  );
};

export default Routers;
