import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Popconfirm,
  message,
  Tooltip,
  Row,
  Col,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  CopyOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import api from "../../api/api.jsx";

const { Search } = Input;

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [decodeModalOpen, setDecodeModalOpen] = useState(false);
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeResult, setDecodeResult] = useState(null);

  // fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads");
      setLeads(data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-refresh every 5 seconds
  useEffect(() => {
    fetchLeads(); // initial load

    const interval = setInterval(() => {
      fetchLeads();
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // delete lead
  const deleteLead = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      message.success("Lead deleted");
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(err);
      message.error("Failed to delete lead");
    }
  };

  // helpers: copy text to clipboard
  const copyToClipboard = async (text, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(label);
    } catch {
      message.error("Copy failed");
    }
  };

  // encode lead object as base64
  const encodeLead = (lead) => {
    try {
      const json = JSON.stringify(lead);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      return b64;
    } catch (err) {
      console.error(err);
      message.error("Encode failed");
      return null;
    }
  };

  // decode base64 -> JSON object
  const decodeBase64 = (b64) => {
    try {
      const json = decodeURIComponent(escape(atob(b64)));
      return JSON.parse(json);
    } catch (err) {
      throw new Error("Invalid base64 / JSON");
    }
  };

  // export visible leads to CSV
  const exportCSV = (rows) => {
    if (!rows?.length) {
      message.info("No rows to export");
      return;
    }

    const keys = [
      "_id",
      "name",
      "email",
      "googleId",
      "picture",
      "source",
      "ip",
      "userAgent",
      "createdAt",
    ];

    const csv = [
      keys.join(","),
      ...rows.map((r) =>
        keys
          .map((k) => {
            const v = r[k];
            if (v === undefined || v === null) return "";
            return `"${String(v).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    message.success("CSV exported");
  };

  // filtered rows based on search
  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    const q = searchTerm.toLowerCase();
    return leads.filter((l) => {
      return (
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.googleId && l.googleId.toLowerCase().includes(q)) ||
        (l.ip && l.ip.toLowerCase().includes(q))
      );
    });
  }, [leads, searchTerm]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (t) => t || "—",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (t) => t || "—",
      width: 220,
    },
    {
      title: "Source",
      dataIndex: "source",
      width: 140,
      render: (s) => <Tag>{s}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 160,
      render: (d) => (d ? new Date(d).toLocaleString() : "—"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      width: 220,
      render: (_id, record) => (
        <Space size="middle">
          <Tooltip title="View full JSON">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedLead(record);
                setViewModalOpen(true);
              }}
              size="small"
            />
          </Tooltip>

          <Popconfirm
            title="Delete this lead?"
            onConfirm={() => deleteLead(_id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="User Leads"
      extra={
        <Space>
          <Search
            placeholder="Search name / email / googleId / ip"
            onSearch={(v) => setSearchTerm(v)}
            style={{ width: 320 }}
            allowClear
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => exportCSV(filteredLeads)}
          >
            Export CSV
          </Button>

          <Button onClick={fetchLeads}>Refresh</Button>
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

      {/* VIEW JSON MODAL */}
      <Modal
        title={`Lead details ${
          selectedLead?.name ? `— ${selectedLead.name}` : ""
        }`}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={780}
      >
        {selectedLead ? (
          <div
            style={{
              maxHeight: 440,
              overflow: "auto",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(selectedLead, null, 2)}
          </div>
        ) : (
          <div>No lead selected</div>
        )}
      </Modal>

      {/* DECODE BASE64 MODAL */}
      <Modal
        title="Decode Base64 string (paste encoded lead)"
        open={decodeModalOpen}
        onCancel={() => {
          setDecodeModalOpen(false);
          setDecodeInput("");
          setDecodeResult(null);
        }}
        footer={[
          <Button
            key="decode"
            type="primary"
            onClick={() => {
              try {
                const obj = decodeBase64(decodeInput.trim());
                setDecodeResult(obj);
                message.success("Decoded successfully");
              } catch (err) {
                setDecodeResult(null);
                message.error("Invalid base64 / JSON");
              }
            }}
          >
            Decode
          </Button>,
          <Button
            key="copy"
            onClick={() => {
              if (!decodeResult) {
                message.info("Nothing decoded yet");
                return;
              }
              copyToClipboard(
                JSON.stringify(decodeResult, null, 2),
                "Decoded JSON copied"
              );
            }}
          >
            Copy Decoded JSON
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setDecodeModalOpen(false);
              setDecodeInput("");
              setDecodeResult(null);
            }}
          >
            Close
          </Button>,
        ]}
      >
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Input.TextArea
              rows={4}
              placeholder="Paste base64-encoded lead here..."
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <div
              style={{
                minHeight: 120,
                background: "#fafafa",
                padding: 12,
                borderRadius: 6,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              {decodeResult ? (
                JSON.stringify(decodeResult, null, 2)
              ) : (
                <span style={{ color: "#888" }}>
                  Decoded object will appear here.
                </span>
              )}
            </div>
          </Col>
        </Row>
      </Modal>
    </Card>
  );
};

export default AdminLeads;
