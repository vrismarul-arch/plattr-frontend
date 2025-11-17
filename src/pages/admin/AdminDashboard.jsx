import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Card, Image, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";
import ProductForm from "./ProductForm";
import './admin.css'
const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      message.success("Product deleted");
    } catch (err) {
      message.error("Failed to delete");
    }
  };

  const handleSave = (product) => {
    const exists = products.find((p) => p._id === product._id);
    if (exists) {
      setProducts(products.map((p) => (p._id === product._id ? product : p)));
    } else {
      setProducts([...products, product]);
    }
    setModalVisible(false);
    setEditingProduct(null);
  };

  const columns = [
    { title: "Image", dataIndex: "img", render: (img) => <Image src={img.startsWith("http") ? img : `http://localhost:5000${img}`} width={60} /> },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "desc" },
    { title: "Prices", dataIndex: "prices", render: (prices) => (
        <>
          <div>One-Time: ₹{prices.oneTime}</div>
          <div>3 Days: ₹{prices.threeDays}</div>
          <div>7 Days: ₹{prices.sevenDays}</div>
          <div>30 Days: ₹{prices.thirtyDays}</div>
        </>
      )
    },
    { title: "Rating", dataIndex: "rating" },
    { title: "Action", dataIndex: "_id", render: (id, record) => (
      <>
        <Button icon={<EditOutlined />} style={{ marginRight: 8 }} onClick={() => { setEditingProduct(record); setModalVisible(true); }} />
        <Popconfirm title="Delete this product?" onConfirm={() => deleteProduct(id)}>
  <Button 
    className="popconfirm-button" 
    danger 
    icon={<DeleteOutlined />} 
  />
</Popconfirm>

      </>
    )}
  ];

  return (
    <div style={{ padding: 30 }}>
      <h1 >Admin Product Dashboard</h1>

      <Button type="primary" style={{ marginBottom: 20 }} onClick={() => setModalVisible(true)}>
        Add Product
      </Button>

      <ProductForm
        visible={modalVisible}
        product={editingProduct}
        onClose={() => { setModalVisible(false); setEditingProduct(null); }}
        onProductSaved={handleSave}
      />

      <Card title="All Products" style={{ marginTop: 20 }}>
        <Table dataSource={products} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
