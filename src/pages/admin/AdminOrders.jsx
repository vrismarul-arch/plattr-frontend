import React, { useEffect, useState } from "react";
import api from "../../api/api.jsx";
import {
  Table,
  Card,
  Select,
  Tabs,
  Button,
  Modal,
  Divider,
  Tag,
} from "antd";
import toast from "react-hot-toast";
import "./AdminOrders.css";

const { Option } = Select;
const { TabPane } = Tabs;

const statusTabs = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "payment-success", label: "Payment Success" },
  { key: "order-complete", label: "Complete" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔵 FETCH ORDERS
  const fetchOrders = async () => {
    const loadToast = toast.loading("Loading orders...");
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
      setFiltered(res.data);
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

  // 🔵 UPDATE STATUS WITH FULL-PAGE REFRESH
  const updateStatus = async (id, value) => {
    const updateToast = toast.loading("Updating status...");
    try {
      await api.put(`/orders/${id}/status`, { status: value });
      toast.success("Status updated!", { id: updateToast });

      // 🔥 Refresh whole page
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update status", { id: updateToast });
    }
  };

  // 🔵 FILTER ORDERS
  const filterStatus = (key) => {
    if (key === "all") return setFiltered(orders);
    setFiltered(orders.filter((o) => o.status === key));
  };

  // 🔵 TABLE COLUMNS
  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (id) => <b>{id}</b>,
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
      title: "View",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => openDetail(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const openDetail = (order) => {
    setSelectedOrder(order);
    setDetailModal(true);
  };

  return (
    <>
      <Card title="Order Management" style={{ marginBottom: 20 }}>
        <Tabs defaultActiveKey="all" onChange={filterStatus}>
          {statusTabs.map((t) => (
            <TabPane tab={t.label} key={t.key} />
          ))}
        </Tabs>

        <Table
          loading={loading}
          dataSource={filtered}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* ORDER DETAILS */}
      <Modal
        open={detailModal}
        onCancel={() => {
          setDetailModal(false);

          // 🔥 Refresh entire page when closing modal
          window.location.reload();
        }}
        footer={null}
        title="Order Details"
      >
        {selectedOrder && (
          <>
            <h3>Order #{selectedOrder.orderId}</h3>
            <Divider />

            <h4>Customer Info</h4>
            <p><b>Name:</b> {selectedOrder.user?.name}</p>
            <p><b>Email:</b> {selectedOrder.user?.email}</p>
            <Divider />

            <h4>Items</h4>
            {selectedOrder.items.map((item) => (
              <Card key={item._id} style={{ marginBottom: 12 }}>
                <b>{item.name}</b>
                <p>Option: {item.selectedOption}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </Card>
            ))}

            <Divider />

            <h4>Order Summary</h4>
            <p><b>Total Amount:</b> ₹{selectedOrder.totalAmount}</p>

            {selectedOrder.deliveryStartDate && (
              <>
                <p>
                  <b>Delivery Start:</b>{" "}
                  {new Date(selectedOrder.deliveryStartDate).toLocaleDateString()}
                </p>
                <p>
                  <b>Delivery End:</b>{" "}
                  {new Date(selectedOrder.deliveryEndDate).toLocaleDateString()}
                </p>
              </>
            )}

            <p>
              <b>Status:</b>
              <Tag color="blue">{selectedOrder.status.toUpperCase()}</Tag>
            </p>

            <Divider />

            <Button
              block
              onClick={() => {
                setDetailModal(false);

                // 🔥 Refresh full page on modal close
                window.location.reload();
              }}
            >
              Close
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default AdminOrders;
