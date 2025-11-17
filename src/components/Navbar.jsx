import React, { useState, useEffect } from "react";
import {
  Layout,
  Drawer,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Menu,
  Badge,
} from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { cartItems } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  // Menu click handler
  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const userMenu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: "profile",
          label: "Profile",
          icon: <UserOutlined />,
        },
        {
          key: "logout",
          label: "Logout",
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  return (
    <Header className="navbar-header">
      {/* Logo */}
      <div className="navbar-logo">
        <Text strong className="navbar-logo-text">
          <a href="/">
            <img src={logo} alt="Tintd Salon" />
          </a>
        </Text>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Cart Icon with Badge */}
        <Badge count={cartCount} showZero>
          <ShoppingCartOutlined
            style={{ fontSize: "24px", cursor: "pointer", marginRight: "20px" }}
            onClick={() => navigate("/cart")}
          />
        </Badge>

        {/* Avatar Dropdown */}
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Space className="navbar-user">
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        title="Account"
        placement="right"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Dropdown overlay={userMenu} placement="bottomLeft">
          <Button block icon={<UserOutlined />}>
            Account Options
          </Button>
        </Dropdown>
      </Drawer>
    </Header>
  );
};

export default Navbar;
