import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Card } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";
import BannerForm from "./BannerForm";

const BannerAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/banners");
      setBanners(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSave = (banner) => {
    const exists = banners.find((b) => b._id === banner._id);
    if (exists) setBanners(banners.map((b) => (b._id === banner._id ? banner : b)));
    else setBanners([...banners, banner]);
    setModalVisible(false);
    setEditingBanner(null);
  };

  const deleteBanner = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
      message.success("Banner deleted");
    } catch {
      message.error("Failed to delete");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Image", dataIndex: "imageUrl", render: (url) => <img src={`http://localhost:5000${url}`} width={80} /> },
    { title: "Link", dataIndex: "link" },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => { setEditingBanner(record); setModalVisible(true); }} style={{ marginRight: 8 }} />
          <Popconfirm title="Delete this banner?" onConfirm={() => deleteBanner(id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin Banner Dashboard</h1>
      <Button type="primary" style={{ marginBottom: 20 }} onClick={() => setModalVisible(true)}>
        Add Banner
      </Button>

      <BannerForm
        visible={modalVisible}
        banner={editingBanner}
        onClose={() => { setModalVisible(false); setEditingBanner(null); }}
        onSaved={handleSave}
      />

      <Card title="All Banners">
        <Table dataSource={banners} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default BannerAdmin;
