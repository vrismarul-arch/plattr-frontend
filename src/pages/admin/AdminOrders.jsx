import React, { useEffect, useState } from "react";
import api from "../../api/api.jsx";
import { Table, Card, Select } from "antd";
import toast from "react-hot-toast";

const { Option } = Select;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    const loadToast = toast.loading("Loading orders...");
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
      toast.success("Orders loaded!", { id: loadToast });
    } catch (err) {
      toast.error("Failed to fetch orders!", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update Status
  const updateStatus = async (id, value) => {
    const updateToast = toast.loading("Updating status...");
    try {
      await api.put(`/orders/${id}/status`, { status: value });

      toast.success("Status updated!", { id: updateToast });

      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status", { id: updateToast });
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
    },
    {
      title: "Customer",
      dataIndex: "user",
      render: (u) => u?.name || "Guest",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (a) => `₹${a}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 160 }}
          onChange={(value) => updateStatus(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="payment-success">Payment Success</Option>
          <Option value="order-complete">Order Complete</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
        </Select>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleString(),
    },
  ];

  return (
    <Card title="All Orders">
      <Table
        loading={loading}
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default AdminOrders;
