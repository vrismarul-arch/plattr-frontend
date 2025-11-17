import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Row, Col, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";

const ProductForm = ({ visible, product, onClose, onProductSaved }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // Populate form when product changes
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        desc: product.desc,
        rating: product.rating || 0,
        prices: {
          oneTime: product.prices?.oneTime || 0,
          threeDays: product.prices?.threeDays || 0,
          sevenDays: product.prices?.sevenDays || 0,
          thirtyDays: product.prices?.thirtyDays || 0,
        },
      });

      setFileList(
        product.img
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: product.img.startsWith("http") ? product.img : `http://localhost:5000${product.img}`,
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [product, form]);

  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const formData = new FormData();

      if (fileList[0]?.originFileObj) formData.append("image", fileList[0].originFileObj);

      formData.append("name", values.name);
      formData.append("desc", values.desc);
      formData.append("rating", values.rating || 0);
      formData.append("oneTime", values.prices.oneTime || 0);
      formData.append("threeDays", values.prices.threeDays || 0);
      formData.append("sevenDays", values.prices.sevenDays || 0);
      formData.append("thirtyDays", values.prices.thirtyDays || 0);

      let res;
      if (product) {
        res = await api.put(`/products/${product._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      message.success(`Product ${product ? "updated" : "added"} successfully!`);
      onProductSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={product ? "Edit Product" : "Add Product"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {product ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Product Image">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleUploadChange}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="desc" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Form.Item name={["prices", "oneTime"]} label="One-Time (₹)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name={["prices", "threeDays"]} label="3 Days (₹)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name={["prices", "sevenDays"]} label="7 Days (₹)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name={["prices", "thirtyDays"]} label="30 Days (₹)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="rating" label="Rating (⭐)">
          <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
