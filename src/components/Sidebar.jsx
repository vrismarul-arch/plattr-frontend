import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/logo.png";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: DashboardOutlined,
      children: [{ key: "/admin/dashboard", title: "Leads Dashboard", path: "/admin/dashboard" }],
    },
    {
      key: "application",
      title: "Application",
      icon: AppstoreOutlined,
      children: [
                { key: "/admin/products", title: "Products", path: "/admin/products" },

        { key: "/admin/banneradmin", title: "Banners", path: "/admin/banneradmin" },
        { key: "/admin/orders", title: "Orders", path: "/admin/orders" },
      ],
    }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={240}
      collapsedWidth={80}
      style={{
        minHeight: "100vh",
        position: "relative", // changed from fixed to relative
        transition: "all 0.3s",
      }}
    >
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className={collapsed ? "logo-collapsed" : "logo-expanded"} />
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        className="sidebar-menu"
      >
        <div className="menu-title">MAIN MENU</div>
        {menuItems.map((menu) => {
          const Icon = menu.icon;
          return menu.children ? (
            <Menu.SubMenu key={menu.key} icon={<Icon />} title={menu.title}>
              {menu.children.map((child) => (
                <Menu.Item key={child.path}>
                  <Link to={child.path}>{child.title}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={menu.key} icon={<Icon />}>
              <Link to={menu.path}>{menu.title}</Link>
            </Menu.Item>
          );
        })}
      </Menu>

      <div className="sidebar-footer">
        <Button type="text" className="collapse-btn" onClick={toggleSidebar}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
