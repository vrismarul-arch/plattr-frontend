import React, { useEffect, useState } from "react";
import api from "../../api/api.jsx";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  DatePicker,
  Popover,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  ShopOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import "./dashboard.css";

const { RangePicker } = DatePicker;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MainDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products!");
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
      setFilteredOrders(res.data);

      const today = dayjs().startOf("day");
      const todayList = res.data.filter((o) =>
        dayjs(o.createdAt).isAfter(today)
      );
      setTodayOrders(todayList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders!");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // Date Filter
  const applyDateFilter = (orders, range) => {
    if (!range) return orders;

    const [start, end] = range;

    return orders.filter((order) => {
      const orderDate = dayjs(order.createdAt);
      return (
        orderDate.isAfter(start.startOf("day")) &&
        orderDate.isBefore(end.endOf("day"))
      );
    });
  };

  const onDateChange = (range) => {
    setDateRange(range);
    const filtered = applyDateFilter(orders, range);
    setFilteredOrders(filtered);

    const today = dayjs().startOf("day");
    const todayList = filtered.filter((o) =>
      dayjs(o.createdAt).isAfter(today)
    );
    setTodayOrders(todayList);
  };

  // Chart Data
  useEffect(() => {
    const lineData = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const index = acc.findIndex((item) => item.date === date);

      if (index >= 0) {
        acc[index].orders += 1;
        acc[index].revenue += order.totalAmount;
      } else {
        acc.push({
          date,
          orders: 1,
          revenue: order.totalAmount,
        });
      }
      return acc;
    }, []);

    setChartData(lineData);

    const statusCount = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.keys(statusCount).map((key) => ({
      name: key,
      value: statusCount[key],
    }));

    setStatusData(pieData);
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const renderOrderDetails = (order) => (
    <div style={{ maxWidth: 300 }}>
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>User:</b> {order.user?.name || "Guest"}</p>
      <p><b>Email:</b> {order.user?.email || "N/A"}</p>
      <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
      <p><b>Items:</b></p>
      <ul style={{ paddingLeft: 15 }}>
        {order.items?.map((item) => (
          <li key={item._id}>
            {item.name} - {item.selectedOption} x {item.quantity} (₹{item.price})
          </li>
        ))}
      </ul>
      {order.deliveryStartDate && (
        <>
          <p><b>Delivery:</b> {dayjs(order.deliveryStartDate).format("DD/MM/YYYY")} - {dayjs(order.deliveryEndDate).format("DD/MM/YYYY")}</p>
        </>
      )}
      <p><b>Status:</b> {order.status.toUpperCase()}</p>
    </div>
  );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      render: (_, __, index) =>
        `PLATTER-${String(index + 1).padStart(3, "0")}`,
    },
    {
      title: "User",
      dataIndex: "user",
      render: (user) => user?.name,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = "orange";
        if (status === "order-complete") color = "green";
        if (status === "payment-success") color = "blue";
        if (status === "shipped") color = "purple";
        if (status === "delivered") color = "cyan";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "View",
      render: (_, record) => (
        <Popover
          content={renderOrderDetails(record)}
          title="Order Details"
          trigger="click"
        >
          <Button type="primary" icon={<EyeOutlined />} size="small">
            View
          </Button>
        </Popover>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        <RangePicker onChange={onDateChange} />
      </div>

      <Row gutter={16} className="stats-cards">
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Products"
              value={products.length}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Orders"
              value={filteredOrders.length}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col xs={24} md={12}>
          <Card title="Orders & Revenue Over Time" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Orders by Status" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Orders Tables Side by Side */}
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Orders">
            <Table
              dataSource={filteredOrders.slice(0, 10)}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Today's Orders">
            <Table
              dataSource={todayOrders}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MainDashboard;
