import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Card, Image, message, Spin } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";
import ProductForm from "./ProductForm";
import "./admin.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success("Product deleted successfully!");
      window.location.reload(); // Full reload after delete
    } catch (err) {
      message.error("Failed to delete product");
    }
  };

  // FULL PAGE RELOAD AFTER SAVE
  const handleSave = () => {
    setModalVisible(false);
    setEditingProduct(null);
    window.location.reload(); // 🔥 FORCE FULL PAGE REFRESH
  };

  // Table Columns
  const columns = [
    {
      title: "Image",
      dataIndex: "img",
      render: (img) => (
        <Image
          src={img.startsWith("http") ? img : `http://localhost:5000${img}`}
          width={60}
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "desc" },
    {
      title: "Prices",
      dataIndex: "prices",
      render: (prices) => (
        <>
          <div>
            <b>One-Time:</b> ₹{prices.oneTime}
          </div>
          <div>
            <b>Monthly:</b> ₹{prices.monthly}
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Weekly 3 Days:</b>
            <div>Mon-Wed-Fri: ₹{prices.weekly3?.monWedFri || 0}</div>
            <div>Tue-Thu-Sat: ₹{prices.weekly3?.tueThuSat || 0}</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Weekly 6 Days:</b>
            <div>Mon to Sat: ₹{prices.weekly6?.monToSat || 0}</div>
          </div>
        </>
      ),
    },
    { title: "Rating", dataIndex: "rating" },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => {
              setEditingProduct(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => deleteProduct(id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      <h1>Admin Product Dashboard 🛒</h1>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 20 }}
        onClick={() => {
          setEditingProduct(null);
          setModalVisible(true);
        }}
      >
        Add Product
      </Button>

      <ProductForm
        visible={modalVisible}
        product={editingProduct}
        onClose={() => {
          setModalVisible(false);
          setEditingProduct(null);
        }}
        onProductSaved={handleSave} // 🚀 Reload page after save
      />

      <Card title="All Products" style={{ marginTop: 20 }}>
        <Spin spinning={loading} tip="Fetching products...">
          <Table
            dataSource={products}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "No Products Found" }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AdminDashboard;
