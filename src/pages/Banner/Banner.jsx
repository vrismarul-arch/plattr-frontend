import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api/api.jsx"; // your axios instance

// Custom arrows
const PrevArrow = ({ className, style, onClick }) => (
  <button className={`custom-arrow prev ${className}`} style={style} onClick={onClick}>
    <ChevronLeft size={28} />
  </button>
);

const NextArrow = ({ className, style, onClick }) => (
  <button className={`custom-arrow next ${className}`} style={style} onClick={onClick}>
    <ChevronRight size={28} />
  </button>
);

export default function Banner() {
  const [isMobile, setIsMobile] = useState(false);
  const [banners, setBanners] = useState([]);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/banners");

        // Ensure each banner has correct full image URL
        const backendBase = api.defaults.baseURL.replace("/api", "");
        const formattedBanners = data.map((b) => ({
          ...b,
          imageUrl: b.imageUrl ? `${backendBase}${b.imageUrl}` : "/placeholder.png",
          mobileImageUrl: b.mobileImageUrl ? `${backendBase}${b.mobileImageUrl}` : b.imageUrl ? `${backendBase}${b.imageUrl}` : "/placeholder.png",
        }));

        setBanners(formattedBanners);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };
    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <ul
        style={{
          margin: 0,
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        {dots}
      </ul>
    ),
  };

  return (
    <div className="ads-banner-container">
      <Slider {...settings} className="ads-slick-slider">
        {banners.map((banner, i) => {
          const imageUrl = isMobile ? banner.mobileImageUrl : banner.imageUrl;

          return (
            <div key={i} className="ads-slide">
              <div
                className="ads-slide-bg"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                }}
              >
                <div className="ads-overlay" />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
