import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";
import "./ProductForm.css";

const ProductForm = ({ visible, product, onClose, onProductSaved }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // RESET FORM
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
    }
  }, [visible]);

  // LOAD PRODUCT FOR EDITING
  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        name: product.name,
        desc: product.desc,
        rating: product.rating || 0,
        totalQuantity: product.totalQuantity || "",
        ingredients: product.ingredients || [],

        prices: {
          oneTime: product.prices?.oneTime || 0,
          monthly: product.prices?.monthly || 0,

          weekly3: {
            monWedFri: product.prices?.weekly3?.monWedFri || 0,
            tueThuSat: product.prices?.weekly3?.tueThuSat || 0,
          },

          weekly6: {
            monToSat: product.prices?.weekly6?.monToSat || 0,
          },
        },
      });

      setFileList(
        product.img
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: product.img,
              },
            ]
          : []
      );
    }
  }, [visible, product]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const fd = new FormData();

      // Only send image if new file uploaded
      if (fileList[0]?.originFileObj) {
        fd.append("image", fileList[0].originFileObj);
      }

      fd.append("name", values.name);
      fd.append("desc", values.desc);
      fd.append("rating", values.rating || 0);
      fd.append("totalQuantity", values.totalQuantity || "");
      fd.append("ingredients", JSON.stringify(values.ingredients || []));

      fd.append("oneTime", values.prices.oneTime || 0);
      fd.append("monthly", values.prices.monthly || 0);
      fd.append("weekly3_monWedFri", values.prices.weekly3.monWedFri || 0);
      fd.append("weekly3_tueThuSat", values.prices.weekly3.tueThuSat || 0);
      fd.append("weekly6_monToSat", values.prices.weekly6.monToSat || 0);

      let res;
      if (product) {
        res = await api.put(`/products/${product._id}`, fd);
        message.success("Product updated successfully!");
      } else {
        res = await api.post("/products", fd);
        message.success("Product created successfully!");
      }

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
    <Drawer
      title={product ? "Edit Product" : "Add Product"}
      width={720}
      open={visible}
      onClose={onClose}
      extra={
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          {product ? "Update" : "Save"}
        </Button>
      }
    >
      <Form layout="vertical" form={form}>
        {/* NAME + IMAGE */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Product Image">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                onRemove={() => {
                  setFileList([]);
                  return true;
                }}
                maxCount={1}
                accept="image/*"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* DESCRIPTION */}
        <Form.Item
          name="desc"
          label="Description"
          rules={[{ required: true, message: "Description required" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* QUANTITY */}
        <Form.Item name="totalQuantity" label="Total Quantity">
          <Input placeholder="e.g., 200–220g" />
        </Form.Item>

        {/* INGREDIENTS */}
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              <h3>Ingredients</h3>

              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={12} key={key} style={{ marginBottom: 10 }}>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      label="Ingredient"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Apple" />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      label="Quantity"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="50g / ½ piece" />
                    </Form.Item>
                  </Col>

                  <Col span={4}>
                    <Button
                      danger
                      onClick={() => remove(name)}
                      style={{ marginTop: 30 }}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Add Ingredient
              </Button>
            </>
          )}
        </Form.List>

        {/* PRICES */}
        <h3 style={{ marginTop: 20 }}>Pricing</h3>

        <Row gutter={24}>
          <Col xs={12}>
            <Form.Item name={["prices", "oneTime"]} label="One-Time (₹)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item name={["prices", "monthly"]} label="Monthly (₹)">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <h4>Weekly 3 Days</h4>

        <Row gutter={24}>
          <Col xs={12}>
            <Form.Item
              name={["prices", "weekly3", "monWedFri"]}
              label="Mon–Wed–Fri (₹)"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              name={["prices", "weekly3", "tueThuSat"]}
              label="Tue–Thu–Sat (₹)"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <h4>Weekly 6 Days</h4>

        <Row gutter={24}>
          <Col xs={12}>
            <Form.Item
              name={["prices", "weekly6", "monToSat"]}
              label="Mon–Sat (₹)"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* RATING */}
        <Form.Item name="rating" label="Rating (⭐)">
          <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ProductForm;
