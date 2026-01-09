import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api.jsx";
import { useCart } from "../../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // ================= SELECTION STATES =================
    const [selectedOption, setSelectedOption] = useState("oneTime");
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // ================= LOAD PRODUCT =================
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) return <div className="loader">Loading...</div>;
    if (!product) return <p className="not-found">Product not found</p>;

    // ================= INGREDIENT TOGGLE =================
    const toggleIngredient = (ing) => {
        setSelectedIngredients((prev) =>
            prev.some((i) => i._id === ing._id)
                ? prev.filter((i) => i._id !== ing._id)
                : [...prev, ing]
        );
    };

    // ================= DISPLAY PRICE =================
    const displayPrice =
        selectedOption === "monthly"
            ? product.prices?.monthly
            : selectedOption === "weekly3_MWF"
                ? product.prices?.weekly3?.monWedFri
                : selectedOption === "weekly3_TTS"
                    ? product.prices?.weekly3?.tueThuSat
                    : selectedOption === "weekly6"
                        ? product.prices?.weekly6?.monToSat
                        : product.prices?.oneTime;

    // ================= ADD TO CART =================
    const handleAddToCart = () => {
        const user = localStorage.getItem("user");
        if (!user) return navigate("/login");

        addToCart(
            product,
            selectedOption,
            selectedIngredients // 🔥 MUST PASS THIS
        );

        navigate("/cart");
    };


    return (
        <>
            {/* ================= DESKTOP ================= */}
            <div className="pd-desktop-grid">
                <div className="pd-image-container">
                    <img src={product.img} alt={product.name} className="pd-main-img" />
                    <button className="pd-back-desktop" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>

                <div className="pd-content-pro">
                    <div className="pd-header-pro">
                        <h1 className="pd-title">{product.name}</h1>
                    </div>

                    <p className="pd-desc">{product.desc}</p>

                    {/* ================= ONE TIME / MONTHLY ================= */}                        
<h3 className="pd-subtitle">One Time Weekly Plan</h3>
                    <div className="pricing-grid-pro">                         
                        <div
                            className={`price-box one-time ${selectedOption === "oneTime" ? "selected" : ""
                                }`}
                            onClick={() => setSelectedOption("oneTime")}
                        >
                            <span className="label">One Time Purchase</span>
                            <br />
                            <span className="price">₹{product.prices?.oneTime}</span>
                        </div>

                        <div
                            className={`price-box monthly ${selectedOption === "monthly" ? "selected" : ""
                                }`}
                            onClick={() => setSelectedOption("monthly")}
                        >
                            <span className="label">Monthly Subscription</span>
                            <br />
                            <span className="price">
                                ₹{product.prices?.monthly}
                                <small>/month</small>
                            </span>
                        </div>
                    </div>

                    {/* ================= WEEKLY ================= */}
                    <div className="weekly-plans">
                        <h3>Choose Your Weekly Plan</h3>

                        <div className="weekly-cards">
                            <div
                                className={`weekly-card ${selectedOption === "weekly3_MWF" ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedOption("weekly3_MWF")}
                            >
                                <div className="days">Mon • Wed • Fri</div>
                                <div className="plan">3 Days / Week</div>
                                <div className="wprice">
                                    ₹{product.prices?.weekly3?.monWedFri}
                                </div>
                            </div>

                            <div
                                className={`weekly-card ${selectedOption === "weekly3_TTS" ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedOption("weekly3_TTS")}
                            >
                                <div className="days">Tue • Thu • Sat</div>
                                <div className="plan">3 Days / Week</div>
                                <div className="wprice">
                                    ₹{product.prices?.weekly3?.tueThuSat}
                                </div>
                            </div>

                            <div
                                className={`weekly-card best-value ${selectedOption === "weekly6" ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedOption("weekly6")}
                            >
                                <div className="best-badge">BEST VALUE</div>
                                <div className="days">Mon → Sat</div>
                                <div className="plan">6 Days / Week</div>
                                <div className="wprice highlight">
                                    ₹{product.prices?.weekly6?.monToSat}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= INGREDIENTS ================= */}
                    {product.ingredients?.length > 0 && (
                        <div className="ingredients-section">
                            <h3>Ingredients</h3>
                            <div className="ing-grid">
                                {product.ingredients.map((ing) => (
                                    <div
                                        key={ing._id}
                                        className={`ing-item-pro ${selectedIngredients.some(
                                            (i) => i._id === ing._id
                                        )
                                            ? "selected"
                                            : ""
                                            }`}
                                        onClick={() => toggleIngredient(ing)}
                                    >
                                        <span className="ing-name">{ing.name}</span>
                                        <span className="ing-amt">{ing.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ================= CTA ================= */}
                    <button className="desktop-cta" onClick={handleAddToCart}>
                        <span>Add to Cart • ₹{displayPrice}</span> →
                    </button>
                </div>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="plattr-mobile">
                <div className="top-bar">
                    <button className="pd-back-desktop" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>

                <div className="product-image-container">
                    <img src={product.img} alt={product.name} className="product-img" />
                </div>
                <div className="pd-content-pro">
                    <div className="pd-header-pro">
                        <h1 className="pd-title">{product.name}</h1>
                    </div>

                    <p className="pd-desc">{product.desc}</p>

                    {/* ================= ONE TIME / MONTHLY ================= */}  <h3 className="pd-subtitle">One Time Weekly Plan</h3>

                    <div className="pricing-grid-pro">                       

                        <div
                            className={`price-box one-time ${selectedOption === "oneTime" ? "selected" : ""
                                }`}
                            onClick={() => setSelectedOption("oneTime")}
                        >
                            <span className="label">One Time Purchase</span>
                            <br />
                            <span className="price">₹{product.prices?.oneTime}</span>
                        </div>

                        <div
                            className={`price-box monthly ${selectedOption === "monthly" ? "selected" : ""
                                }`}
                            onClick={() => setSelectedOption("monthly")}
                        >
                            <span className="label">Monthly Subscription</span>
                            <br />
                            <span className="price">
                                ₹{product.prices?.monthly}
                                <small>/month</small>
                            </span>
                        </div>
                    </div>

                    {/* ================= WEEKLY ================= */}
                    <div className="weekly-plans">
                        <h3>Choose Your Weekly Plan</h3>

                        <div className="weekly-cards">
                            <div
                                className={`weekly-card ${selectedOption === "weekly3_MWF" ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedOption("weekly3_MWF")}
                            >
                                <div className="days">Mon • Wed • Fri</div>
                                <div className="plan">3 Days / Week</div>
                                <div className="wprice">
                                    ₹{product.prices?.weekly3?.monWedFri}
                                </div>
                            </div>

                            <div
                                className={`weekly-card ${selectedOption === "weekly3_TTS" ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedOption("weekly3_TTS")}
                            >
                                <div className="days">Tue • Thu • Sat</div>
                                <div className="plan">3 Days / Week</div>
                                <div className="wprice">
                                    ₹{product.prices?.weekly3?.tueThuSat}
                                </div>
                            </div>

                            <div
                                className={`weekly-card best-value ${selectedOption === "weekly6" ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedOption("weekly6")}
                            >
                                <div className="best-badge">BEST VALUE</div>
                                <div className="days">Mon → Sat</div>
                                <div className="plan">6 Days / Week</div>
                                <div className="wprice highlight">
                                    ₹{product.prices?.weekly6?.monToSat}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= INGREDIENTS ================= */}
                    {product.ingredients?.length > 0 && (
                        <div className="ingredients-section">
                            <h3>Ingredients</h3>
                            <div className="ing-grid">
                                {product.ingredients.map((ing) => (
                                    <div
                                        key={ing._id}
                                        className={`ing-item-pro ${selectedIngredients.some(
                                            (i) => i._id === ing._id
                                        )
                                            ? "selected"
                                            : ""
                                            }`}
                                        onClick={() => toggleIngredient(ing)}
                                    >
                                        <span className="ing-name">{ing.name}</span>
                                        <span className="ing-amt">{ing.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                </div>
                <div className="add-to-cart-bar" onClick={handleAddToCart}>
                    <button className="desktop-cta" onClick={handleAddToCart}>
                        <span>Add to Cart • ₹{displayPrice}</span> →
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
