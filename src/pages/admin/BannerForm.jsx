import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";

const BannerForm = ({ open, banner, onClose, onSaved }) => {
  const [form] = Form.useForm();
  const [desktopFile, setDesktopFile] = useState([]);
  const [mobileFile, setMobileFile] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load editing data
  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title || "",
        link: banner.link || "",
      });

      setDesktopFile(
        banner.imageUrl
          ? [
              {
                uid: "-1",
                name: "desktop.png",
                status: "done",
                url: banner.imageUrl,
              },
            ]
          : []
      );

      setMobileFile(
        banner.mobileImageUrl
          ? [
              {
                uid: "-2",
                name: "mobile.png",
                status: "done",
                url: banner.mobileImageUrl,
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setDesktopFile([]);
      setMobileFile([]);
    }
  }, [banner]);

  // Save Banner
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("link", values.link || "");

      // Send only if new desktop image uploaded
      if (desktopFile[0]?.originFileObj) {
        fd.append("desktop", desktopFile[0].originFileObj);
      }

      // Send only if new mobile image uploaded
      if (mobileFile[0]?.originFileObj) {
        fd.append("mobile", mobileFile[0].originFileObj);
      }

      if (banner) {
        await api.put(`/banners/${banner._id}`, fd);
        message.success("Banner updated");
      } else {
        await api.post("/banners", fd);
        message.success("Banner created");
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={banner ? "Edit Banner" : "Add Banner"}
      width={430}
      open={open}
      onClose={onClose}
      extra={
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          Save
        </Button>
      }
    >
      <Form layout="vertical" form={form}>
        {/* Title */}
        <Form.Item name="title" label="Title">
          <Input placeholder="Banner Title" />
        </Form.Item>

        {/* Link */}
        <Form.Item name="link" label="Link">
          <Input placeholder="https://example.com" />
        </Form.Item>

        {/* Desktop Image */}
        <Form.Item label="Desktop Image">
          <Upload
            beforeUpload={() => false}
            listType="picture"
            maxCount={1}
            fileList={desktopFile}
            onChange={({ fileList }) => setDesktopFile(fileList)}
            onRemove={() => {
              setDesktopFile([]);
              return true;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Desktop Image</Button>
          </Upload>
        </Form.Item>

        {/* Mobile Image */}
        <Form.Item label="Mobile Image">
          <Upload
            beforeUpload={() => false}
            listType="picture"
            maxCount={1}
            fileList={mobileFile}
            onChange={({ fileList }) => setMobileFile(fileList)}
            onRemove={() => {
              setMobileFile([]);
              return true;
            }}
          >
            <Button icon={<UploadOutlined />}>Upload Mobile Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default BannerForm;
