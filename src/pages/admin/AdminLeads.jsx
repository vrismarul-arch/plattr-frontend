import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Drawer,
  Popconfirm,
  message,
  Tooltip,
  Row,
  Col,
  Tag,
  Avatar,
  Descriptions,
  Divider,
  Typography,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import api from "../../api/api.jsx";

const { Search } = Input;
const { Text, Paragraph } = Typography;

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);

  const [decodeDrawerOpen, setDecodeDrawerOpen] = useState(false);
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeResult, setDecodeResult] = useState(null);

  // 🔵 FETCH LEADS
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads");
      setLeads(data || []);
    } catch {
      message.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔴 DELETE LEAD
  const deleteLead = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      message.success("Lead deleted");
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch {
      message.error("Failed to delete lead");
    }
  };

  // 🔵 DECODE BASE64
  const decodeBase64 = (b64) => {
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  };

  // 🔵 EXPORT CSV
  const exportCSV = (rows) => {
    if (!rows?.length) return message.info("No rows to export");

    const keys = [
      "_id",
      "name",
      "email",
      "googleId",
      "source",
      "ip",
      "createdAt",
    ];

    const csv = [
      keys.join(","),
      ...rows.map((r) =>
        keys.map((k) => `"${r[k] ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  // 🔵 FILTER
  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const q = searchTerm.toLowerCase();
    return leads.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.googleId?.toLowerCase().includes(q) ||
        l.ip?.toLowerCase().includes(q)
    );
  }, [leads, searchTerm]);

  // 🔵 TABLE COLUMNS
  const columns = [
    { title: "Name", dataIndex: "name", width: 180 },
    { title: "Email", dataIndex: "email", width: 220 },
    {
      title: "Source",
      dataIndex: "source",
      width: 140,
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 160,
      render: (d) => new Date(d).toLocaleString(),
    },
    {
      title: "Actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedLead(record);
                setViewDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Delete this lead?"
            onConfirm={() => deleteLead(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="User Leads"
        extra={
          <Space>
            <Search
              placeholder="Search name / email / googleId / ip"
              onSearch={setSearchTerm}
              allowClear
              style={{ width: 320 }}
            />
            <Button onClick={() => setDecodeDrawerOpen(true)}>
              Decode Base64
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => exportCSV(filteredLeads)}
            >
              Export CSV
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredLeads}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* 🔵 VIEW LEAD DETAILS DRAWER */}
      <Drawer
        title="Lead Details"
        width={720}
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
      >
        {selectedLead && (
          <>
            <div style={{ display: "flex", gap: 16 }}>
              <Avatar src={selectedLead.picture} size={64} />
              <div>
                <Text strong style={{ fontSize: 18 }}>
                  {selectedLead.name}
                </Text>
                <br />
                <Text type="secondary">{selectedLead.email}</Text>
              </div>
            </div>

            <Divider />

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Lead ID">
                <Text copyable>{selectedLead._id}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Google ID">
                <Text copyable>{selectedLead.googleId}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Source">
                <Tag>{selectedLead.source}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="IP Address">
                <Text copyable>{selectedLead.ip}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {new Date(selectedLead.createdAt).toLocaleString()}
              </Descriptions.Item>

              <Descriptions.Item label="Updated At">
                {new Date(selectedLead.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Text strong>Browser / Device Info</Text>
            <Paragraph
              style={{
                background: "#fafafa",
                padding: 12,
                borderRadius: 6,
                fontFamily: "monospace",
                marginTop: 8,
              }}
            >
              {selectedLead.userAgent}
            </Paragraph>
          </>
        )}
      </Drawer>

      {/* 🔵 DECODE BASE64 DRAWER */}
      <Drawer
        title="Decode Base64 Lead"
        placement="bottom"
        height={420}
        open={decodeDrawerOpen}
        onClose={() => {
          setDecodeDrawerOpen(false);
          setDecodeInput("");
          setDecodeResult(null);
        }}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Input.TextArea
              rows={4}
              placeholder="Paste base64-encoded lead..."
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <Button
              type="primary"
              onClick={() => {
                try {
                  setDecodeResult(decodeBase64(decodeInput.trim()));
                  message.success("Decoded successfully");
                } catch {
                  message.error("Invalid base64 / JSON");
                }
              }}
            >
              Decode
            </Button>
          </Col>

          <Col span={24}>
            <pre
              style={{
                minHeight: 160,
                background: "#fafafa",
                padding: 12,
                borderRadius: 6,
              }}
            >
              {decodeResult
                ? JSON.stringify(decodeResult, null, 2)
                : "Decoded JSON will appear here"}
            </pre>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default AdminLeads;
