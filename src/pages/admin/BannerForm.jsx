import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../api/api.jsx";

const BannerForm = ({ visible, banner, onClose, onSaved }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({ title: banner.title, link: banner.link });
      setFileList(
        banner.imageUrl
          ? [
              {
                uid: "-1",
                name: "banner.png",
                status: "done",
                url: `http://localhost:5000${banner.imageUrl}`,
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [banner, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!banner && fileList.length === 0) {
        message.error("Please upload an image");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("link", values.link || "");
      if (fileList[0]?.originFileObj) formData.append("image", fileList[0].originFileObj);

      let res;
      if (banner) {
        res = await api.put(`/banners/${banner._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/banners", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      message.success(`Banner ${banner ? "updated" : "created"} successfully`);
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={banner ? "Edit Banner" : "Add Banner"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {banner ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="title" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="link" label="Link">
          <Input />
        </Form.Item>
        <Form.Item label="Banner Image">
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BannerForm;
