import { useState } from "react";
import axios from "axios";
import { Form, Input, Select, DatePicker, Checkbox, Button, Steps, Card, message } from "antd";
import "./SantricksForm.css";

const { Option } = Select;
const { Step } = Steps;

const SantricksForm = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    eventType: "",
    name: "",
    date: null,
    venue: "",
    audizeSize: "",
    duration: "",
    addOns: { portrait: false, makingVideo: false, musicSync: false, customTheme: false, liveMode: false },
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (name, value) => {
    if (name in formData.addOns) {
      setFormData({ ...formData, addOns: { ...formData.addOns, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/api/entries/add`, formData);
      message.success("Form submitted successfully!");
      setStep(0);
      setFormData({
        eventType: "",
        name: "",
        date: null,
        venue: "",
        audizeSize: "",
        duration: "",
        addOns: { portrait: false, makingVideo: false, musicSync: false, customTheme: false, liveMode: false },
        contactName: "",
        contactEmail: "",
        contactPhone: ""
      });
    } catch (err) {
      console.error(err);
      message.error("Something went wrong!");
    }
  };

  const steps = [
    {
      title: "Event Details",
      content: (
        <Form layout="vertical">
          <Form.Item label="Event Type*" required>
            <Select placeholder="Select event type" value={formData.eventType} onChange={val => handleChange("eventType", val)}>
              <Option>Corporate Live Show</Option>
              <Option>Wedding Event</Option>
              <Option>Birthday Celebration</Option>
              <Option>Portrait Gifting</Option>
              <Option>Corporate Pre-Shoot</Option>
              <Option>Sand Lightboard</Option>
              <Option>Name Revealing Ceremony</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Event Name">
            <Input value={formData.name} onChange={e => handleChange("name", e.target.value)} />
          </Form.Item>
          <Form.Item label="Event Date*" required>
            <DatePicker style={{ width: "100%" }} value={formData.date} onChange={date => handleChange("date", date)} />
          </Form.Item>
          <Form.Item label="Venue / Location">
            <Input value={formData.venue} onChange={e => handleChange("venue", e.target.value)} />
          </Form.Item>
          <Form.Item label="Audience Size*" required>
            <Select placeholder="Select audience size" value={formData.audizeSize} onChange={val => handleChange("audizeSize", val)}>
              <Option>0-50</Option>
              <Option>51-100</Option>
              <Option>101-200</Option>
              <Option>201-500</Option>
              <Option>500+</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Event Duration*" required>
            <Select placeholder="Select duration" value={formData.duration} onChange={val => handleChange("duration", val)}>
              <Option>1 Hour</Option>
              <Option>2 Hours</Option>
              <Option>3 Hours</Option>
              <Option>Half Day</Option>
              <Option>Full Day</Option>
            </Select>
          </Form.Item>
        </Form>
      )
    },
    {
      title: "Add-ons",
      content: (
        <Form layout="vertical">
          <Form.Item label="Add-ons">
            <Checkbox.Group
              style={{ width: "100%" }}
              value={Object.keys(formData.addOns).filter(k => formData.addOns[k])}
              onChange={checkedValues => {
                const newAddOns = { portrait: false, makingVideo: false, musicSync: false, customTheme: false, liveMode: false };
                checkedValues.forEach(k => (newAddOns[k] = true));
                setFormData({ ...formData, addOns: newAddOns });
              }}
            >
              <Checkbox value="portrait">Portrait</Checkbox>
              <Checkbox value="makingVideo">Making Video</Checkbox>
              <Checkbox value="musicSync">Music Sync</Checkbox>
              <Checkbox value="customTheme">Custom Theme</Checkbox>
              <Checkbox value="liveMode">Live Mode</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      )
    },
    {
      title: "Contact Info",
      content: (
        <Form layout="vertical">
          <Form.Item label="Your Name*" required>
            <Input value={formData.contactName} onChange={e => handleChange("contactName", e.target.value)} />
          </Form.Item>
          <Form.Item label="Your Email*" required>
            <Input type="email" value={formData.contactEmail} onChange={e => handleChange("contactEmail", e.target.value)} />
          </Form.Item>
          <Form.Item label="Your Phone*" required>
            <Input value={formData.contactPhone} onChange={e => handleChange("contactPhone", e.target.value)} />
          </Form.Item>
        </Form>
      )
    },
    {
      title: "Summary",
      content: (
        <Card title="Summary" bordered>
          <p><strong>Event Type:</strong> {formData.eventType}</p>
          <p><strong>Event Name:</strong> {formData.name}</p>
          <p><strong>Date:</strong> {formData.date ? formData.date.format("YYYY-MM-DD") : ""}</p>
          <p><strong>Venue:</strong> {formData.venue}</p>
          <p><strong>Audience Size:</strong> {formData.audizeSize}</p>
          <p><strong>Duration:</strong> {formData.duration}</p>
          <p><strong>Add-ons:</strong> {Object.keys(formData.addOns).filter(k => formData.addOns[k]).join(", ") || "None"}</p>
          <p><strong>Contact Name:</strong> {formData.contactName}</p>
          <p><strong>Contact Email:</strong> {formData.contactEmail}</p>
          <p><strong>Contact Phone:</strong> {formData.contactPhone}</p>
        </Card>
      )
    }
  ];

  return (
    <div className="hero-container">
      <div className="hero-banner">
        <h1>Book Your Sand Art Event</h1>
        <p>One step at a time — we'll guide you through the process.</p>
      </div>

      <div className="form-container">
        <Steps current={step} responsive>
          {steps.map((s, index) => (
            <Step key={index} title={s.title} />
          ))}
        </Steps>

        <div className="step-content" style={{ marginTop: "20px", transition: "all 0.5s ease" }}>
          {steps[step].content}
        </div>

        <div className="form-navigation" style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          {step > 0 && <Button onClick={prevStep}>Back</Button>}
          {step < steps.length - 1 && <Button type="primary" onClick={nextStep}>Next</Button>}
          {step === steps.length - 1 && <Button type="primary" onClick={handleSubmit}>Submit</Button>}
        </div>
      </div>
    </div>
  );
};

export default SantricksForm;
