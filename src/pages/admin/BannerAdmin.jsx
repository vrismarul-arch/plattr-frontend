// src/components/admin/BannerAdmin.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Card, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";
import BannerForm from "./BannerForm";

// Local uploaded file path (will be transformed to URL by your environment/tooling)
const PLACEHOLDER_IMG = "/mnt/data/c857123b-3e07-4ce0-94bb-8da3c393b626.png";

const BannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/banners");
      // ensure fields exist and provide fallbacks
      const formatted = data.map((b) => ({
        ...b,
        imageUrl: b.imageUrl || PLACEHOLDER_IMG,
        mobileImageUrl: b.mobileImageUrl || b.imageUrl || PLACEHOLDER_IMG,
      }));
      setBanners(formatted);
    } catch (err) {
      console.error("Failed to load banners", err);
      message.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSaved = () => {
    setDrawerOpen(false);
    setEditingBanner(null);
    fetchBanners();
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setEditingBanner(record);
    setDrawerOpen(true);
  };

  const deleteBanner = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      message.success("Banner deleted");
      // optimistic refresh
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      message.error("Failed to delete banner");
    }
  };

  const columns = [
    {
      title: "Preview",
      dataIndex: "imageUrl",
      key: "preview",
      width: 140,
      render: (url, record) => (
        <img
          src={url}
          alt={record.title || "banner"}
          style={{
            width: 120,
            height: 70,
            objectFit: "cover",
            borderRadius: 6,
            border: "1px solid #eee",
          }}
        />
      ),
    },
    { title: "Title", dataIndex: "title", key: "title", ellipsis: true },
    {
      title: "Mobile",
      dataIndex: "mobileImageUrl",
      key: "mobile",
      width: 110,
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="mobile preview"
            style={{
              width: 80,
              height: 110,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #eee",
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>None</span>
        ),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      render: (link) =>
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link.length > 40 ? link.slice(0, 40) + "…" : link}
          </a>
        ) : (
          <span style={{ color: "#999" }}>—</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            aria-label={`Edit ${record.title || "banner"}`}
          />
          <Popconfirm
            title="Delete this banner?"
            onConfirm={() => deleteBanner(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ margin: 0 }}>Banner Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Banner
        </Button>
      </div>

      <BannerForm
        open={drawerOpen}
        banner={editingBanner}
        onClose={() => {
          setDrawerOpen(false);
          setEditingBanner(null);
        }}
        onSaved={handleSaved}
      />

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={banners}
          rowKey={(row) => row._id}
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </div>
  );
};

export default BannerAdmin;
