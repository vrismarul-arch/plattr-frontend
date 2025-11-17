// Layout.jsx
import React, { useState } from "react";
import { Layout, Breadcrumb, Footer } from "antd";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Topbar collapsed={collapsed} toggle={toggle} />
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
          <Breadcrumb style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>©2025 Created by You</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
