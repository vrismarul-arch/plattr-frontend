import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api/api.jsx";

const PrevArrow = ({ className, onClick }) => (
  <button className={`custom-arrow prev`} onClick={onClick}>
    <ChevronLeft size={28} />
  </button>
);

const NextArrow = ({ className, onClick }) => (
  <button className={`custom-arrow next`} onClick={onClick}>
    <ChevronRight size={28} />
  </button>
);

export default function Banner() {
  const [isMobile, setIsMobile] = useState(false);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/banners");

        const formatted = data.map((b) => ({
          ...b,
          imageUrl: b.imageUrl,
          mobileImageUrl: b.mobileImageUrl || b.imageUrl,
        }));

        setBanners(formatted);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
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
                  backgroundImage: `url("${imageUrl}")`,
                }}
              ></div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
