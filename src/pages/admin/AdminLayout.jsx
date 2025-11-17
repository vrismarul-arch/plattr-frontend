// AdminLayout.jsx
import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Outlet } from "react-router-dom";

const { Content, Footer } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* PASS toggle & setCollapsed */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        {/* PASS toggle here too */}
        <Topbar collapsed={collapsed} toggle={toggle} />

        <Content style={{ padding: "20px" }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          ©2025 Plattr
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
