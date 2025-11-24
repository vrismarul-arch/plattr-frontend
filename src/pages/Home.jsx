// src/pages/Home.jsx (or wherever you have it)
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Banner from "./Banner/Banner";
import ProductCard from "./product/ProductCard";
import FreshSteps from "../components/FreshSteps";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5s feels nice
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen text="Fetching delicious meals..." />;
  }

  return (
    <div>
      <Navbar />
      <Banner />
      <ProductCard />
      <FreshSteps />
    </div>
  );
};

export default Home;