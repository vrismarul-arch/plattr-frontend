import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Card,
  Image,
  message,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../api/api.jsx";
import ProductForm from "./ProductForm";
import "./admin.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔵 FETCH PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data || []);
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

  // 🔴 DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      message.error("Failed to delete product");
    }
  };

  // 🟢 AFTER SAVE (ADD / EDIT)
  const handleSave = () => {
    setModalVisible(false);
    setEditingProduct(null);
    fetchProducts(); // refresh table only
  };

  // 🔵 TABLE COLUMNS (WITH WIDTHS)
  const columns = [
    {
      title: "Image",
      dataIndex: "img",
      width: 90,
      fixed: "left",
      render: (img) => (
        <Image
          src={img?.startsWith("http") ? img : `http://localhost:5000${img}`}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 6 }}
          preview={false}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 180,
    },
    {
      title: "Description",
      dataIndex: "desc",
      width: 280,
      ellipsis: true,
    },
    {
      title: "Prices",
      dataIndex: "prices",
      width: 320,
      render: (prices) => (
        <>
          <div>
            <b>One-Time:</b> ₹{prices?.oneTime ?? 0}
          </div>
          <div>
            <b>Monthly:</b> ₹{prices?.monthly ?? 0}
          </div>

          <div style={{ marginTop: 6 }}>
            <b>Weekly 3 Days:</b>
            <div>Mon-Wed-Fri: ₹{prices?.weekly3?.monWedFri ?? 0}</div>
            <div>Tue-Thu-Sat: ₹{prices?.weekly3?.tueThuSat ?? 0}</div>
          </div>

          <div style={{ marginTop: 6 }}>
            <b>Weekly 6 Days:</b>
            <div>Mon to Sat: ₹{prices?.weekly6?.monToSat ?? 0}</div>
          </div>
        </>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      width: 100,
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 130,
      fixed: "right",
      render: (id, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
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
            <Button danger size="small" icon={<DeleteOutlined />} />
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

      {/* PRODUCT FORM MODAL */}
      <ProductForm
        visible={modalVisible}
        product={editingProduct}
        onClose={() => {
          setModalVisible(false);
          setEditingProduct(null);
        }}
        onProductSaved={handleSave}
      />

      <Card title="All Products" style={{ marginTop: 20 }}>
        <Spin spinning={loading} tip="Fetching products...">
          <Table
            dataSource={products}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "No Products Found" }}
            scroll={{ x: 1200 }}   // 🔥 REQUIRED WITH WIDTHS
          />
        </Spin>
      </Card>
    </div>
  );
};

export default AdminDashboard;
