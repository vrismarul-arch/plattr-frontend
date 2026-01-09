import React, { useEffect, useState } from "react";
import api from "../../api/api.jsx";
import {
  Table,
  Card,
  Select,
  Tabs,
  Button,
  Drawer,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  // 🔵 UPDATE ORDER STATUS
  const updateStatus = async (id, value) => {
    const updateToast = toast.loading("Updating status...");
    try {
      await api.put(`/orders/${id}/status`, { status: value });
      toast.success("Status updated!", { id: updateToast });
      fetchOrders(); // refresh data only
    } catch (err) {
      toast.error("Failed to update status", { id: updateToast });
    }
  };

  // 🔵 FILTER ORDERS
  const filterStatus = (key) => {
    if (key === "all") {
      setFiltered(orders);
    } else {
      setFiltered(orders.filter((o) => o.status === key));
    }
  };

  // 🔵 OPEN DRAWER
  const openDetail = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
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
          style={{ width: 170 }}
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
        <Button type="primary" size="small" onClick={() => openDetail(record)}>
          View Details
        </Button>
      ),
    },
  ];

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

      {/* 🔵 ORDER DETAILS DRAWER */}
      {/* 🔵 ORDER DETAILS DRAWER */}
<Drawer
  title="Order Details"
  placement="right"
  width={480}
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
>
  {selectedOrder && (
    <>
      {/* ORDER HEADER */}
      <h3>Order #{selectedOrder.orderId}</h3>
      <p>
        <b>Placed On:</b>{" "}
        {new Date(selectedOrder.createdAt).toLocaleString()}
      </p>
      <p>
        <b>Payment Method:</b> {selectedOrder.paymentMethod.toUpperCase()}
      </p>

      <Divider />

      {/* CUSTOMER INFO */}
      <h4>Customer Info</h4>
      <p><b>Name:</b> {selectedOrder.user?.name}</p>
      <p><b>Email:</b> {selectedOrder.user?.email}</p>

      <Divider />

      {/* DELIVERY INFO */}
      <h4>Delivery Schedule</h4>
      <p>
        <b>Start Date:</b>{" "}
        {new Date(selectedOrder.deliveryStartDate).toLocaleDateString()}
      </p>
      <p>
        <b>End Date:</b>{" "}
        {new Date(selectedOrder.deliveryEndDate).toLocaleDateString()}
      </p>

      <Divider />

      {/* ITEMS */}
      <h4>Ordered Items</h4>

      {selectedOrder.items.map((item) => (
        <Card
          key={item._id}
          size="small"
          style={{ marginBottom: 14 }}
        >
          <p><b>Product:</b> {item.name}</p>
          <p><b>Option:</b> {item.selectedOption}</p>
          <p><b>Quantity:</b> {item.quantity}</p>
          <p><b>Price:</b> ₹{item.price}</p>

          {/* INGREDIENTS */}
          {item.selectedIngredients?.length > 0 && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <b>Selected Ingredients:</b>
              <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                {item.selectedIngredients.map((ing) => (
                  <li key={ing._id}>
                    {ing.name} — <i>{ing.quantity}</i>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      ))}

      <Divider />

      {/* ORDER SUMMARY */}
      <h4>Order Summary</h4>
      <p><b>Total Amount:</b> ₹{selectedOrder.totalAmount}</p>

      <p>
        <b>Status:</b>{" "}
        <Tag color="orange">
          {selectedOrder.status.toUpperCase()}
        </Tag>
      </p>

      <Divider />

      <Button block type="primary" onClick={() => setDrawerOpen(false)}>
        Close
      </Button>
    </>
  )}
</Drawer>

    </>
  );
};

export default AdminOrders;
