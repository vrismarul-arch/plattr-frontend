import React from "react";
import { Layout, Button, Avatar, Dropdown } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./Topbar.css";

const { Header } = Layout;

const Topbar = ({ collapsed, toggle }) => {
  const menuItems = [
    {
      key: "1",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => (window.location.href = "/admin/profile"),
    },
    
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      },
    },
  ];

  return (
    <Header className="topbar">
      <div className="left-section">
        
        <h3 className="page-title">Dashboard</h3>
      </div>

      <div className="right-section">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <div className="profile-box">
            <Avatar size={38} icon={<UserOutlined />} />
            <span className="profile-name">Admin</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
