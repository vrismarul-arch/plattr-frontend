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
  Calendar,
  Drawer,
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

/* ================= PLAN → WEEKDAYS ================= */
const PLAN_DAYS_MAP = {
  weekly3_MWF: [1, 3, 5], // Mon Wed Fri
  weekly3_TTS: [2, 4, 6], // Tue Thu Sat
  weekly6: [1, 2, 3, 4, 5, 6], // Mon–Sat
};

/* ================= DELIVERY DATE GENERATOR ================= */
const generateDeliveryDatesFromRange = (order) => {
  const start = order.deliveryStartDate;
  const end = order.deliveryEndDate;
  const plan = order.items?.[0]?.selectedOption;

  if (!start || !end || !PLAN_DAYS_MAP[plan]) return [];

  const allowedDays = PLAN_DAYS_MAP[plan];
  const dates = [];

  let current = dayjs(start);
  const endDate = dayjs(end);

  while (current.diff(endDate, "day") <= 0) {
    if (allowedDays.includes(current.day())) {
      dates.push(current.format("YYYY-MM-DD"));
    }
    current = current.add(1, "day");
  }

  return dates;
};

const MainDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [todayOrders, setTodayOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [calendarDate, setCalendarDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDateOrders, setSelectedDateOrders] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
      setFilteredOrders(res.data);

      const today = dayjs().format("YYYY-MM-DD");
      setTodayOrders(
        res.data.filter((o) =>
          generateDeliveryDatesFromRange(o).includes(today)
        )
      );
    } catch {
      toast.error("Failed to fetch orders");
    }
  };

  /* ================= DATE FILTER (CREATED DATE) ================= */
  const onDateChange = (range) => {
    if (!range) {
      setFilteredOrders(orders);
      return;
    }

    const [start, end] = range;
    setFilteredOrders(
      orders.filter(
        (o) =>
          dayjs(o.createdAt).diff(start.startOf("day")) >= 0 &&
          dayjs(o.createdAt).diff(end.endOf("day")) <= 0
      )
    );
  };

  /* ================= CHART DATA ================= */
  useEffect(() => {
    const lineData = [];
    const statusCount = {};

    filteredOrders.forEach((o) => {
      const date = dayjs(o.createdAt).format("DD MMM");
      const idx = lineData.findIndex((d) => d.date === date);

      if (idx >= 0) {
        lineData[idx].orders += 1;
        lineData[idx].revenue += o.totalAmount;
      } else {
        lineData.push({
          date,
          orders: 1,
          revenue: o.totalAmount,
        });
      }

      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });

    setChartData(lineData);
    setStatusData(
      Object.keys(statusCount).map((k) => ({
        name: k,
        value: statusCount[k],
      }))
    );
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  /* ================= CALENDAR ================= */
  const dateCellRender = (value) => {
    const day = value.format("YYYY-MM-DD");

    const count = orders.filter((o) =>
      generateDeliveryDatesFromRange(o).includes(day)
    ).length;

    if (!count) return null;

    return (
      <div className="calendar-dot-wrapper">
        <span className="calendar-dot">{count}</span>
      </div>
    );
  };

  const onCalendarSelect = (value) => {
    const day = value.format("YYYY-MM-DD");

    const dayOrders = orders.filter((o) =>
      generateDeliveryDatesFromRange(o).includes(day)
    );

    setCalendarDate(value);
    setSelectedDateOrders(dayOrders);
    setDrawerOpen(true);
  };

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "Order ID",
      render: (_, r) => r.orderId,
    },
    {
      title: "User",
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
      render: (s) => (
        <Tag color={s === "delivered" ? "green" : "orange"}>
          {s.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "View",
      render: (_, r) => (
        <Popover
          trigger="click"
          title="Order Details"
          content={
            <>
              <p><b>User:</b> {r.user?.name}</p>
              <p><b>Total:</b> ₹{r.totalAmount}</p>
              <p><b>Plan:</b> {r.items[0]?.selectedOption}</p>
            </>
          }
        >
          <Button icon={<EyeOutlined />} size="small" />
        </Popover>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      <Toaster />
      <h1>Admin Dashboard</h1>

      <RangePicker onChange={onDateChange} />

      {/* STATS */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Products" value={products.length} prefix={<ShopOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Orders" value={filteredOrders.length} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Revenue" value={totalRevenue} prefix={<DollarOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* CALENDAR */}
      <Row style={{ marginTop: 30 }}>
        <Col span={24}>
          <Card title="Delivery Schedule">
            <Calendar dateCellRender={dateCellRender} onSelect={onCalendarSelect} />
          </Card>
        </Col>
      </Row>

      {/* DRAWER (FIXED) */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={420}
        title={`Orders on ${calendarDate?.format("DD MMM YYYY")}`}
      >
       {selectedDateOrders.map((order) => (
  <Card key={order._id} style={{ marginBottom: 12 }}>
    <p><b>Order ID:</b> {order.orderId}</p>
    <p><b>User:</b> {order.user?.name}</p>
    <p><b>Status:</b> {order.status.toUpperCase()}</p>
    <p><b>Plan:</b> {order.items[0]?.selectedOption}</p>

    {/* ITEMS & INGREDIENTS */}
    <p><b>Items:</b></p>
    {order.items.map((item) => (
      <div key={item._id} style={{ marginBottom: 8 }}>
        <p>
          <b>{item.name}</b> × {item.quantity}
        </p>

        {item.selectedIngredients?.length > 0 ? (
          <>
            <p style={{ marginBottom: 4 }}><b>Ingredients:</b></p>
            <ul style={{ marginLeft: 16 }}>
              {item.selectedIngredients.map((ing) => (
                <li key={ing.ingredientId}>
                  {ing.name} ({ing.quantity})
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p style={{ fontStyle: "italic", color: "#888" }}>
            No extra ingredients
          </p>
        )}
      </div>
    ))}

    {/* DELIVERY DAYS */}
    <p><b>Delivery Days:</b></p>
    <ul>
      {generateDeliveryDatesFromRange(order).map((d) => (
        <li key={d}>{dayjs(d).format("DD MMM YYYY")}</li>
      ))}
    </ul>

    <p><b>Total:</b> ₹{order.totalAmount}</p>
  </Card>
))}

      </Drawer>

      {/* TABLES */}
      <Row gutter={16} style={{ marginTop: 30 }}>
        <Col span={12}>
          <Card title="Recent Orders">
            <Table
              dataSource={filteredOrders.slice(0, 10)}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Today's Deliveries">
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
