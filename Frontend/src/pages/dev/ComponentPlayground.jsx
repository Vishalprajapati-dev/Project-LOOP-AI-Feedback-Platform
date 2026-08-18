import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useState } from "react";
import Card from "../../components/ui/Card";
import PageTitle from "../../components/common/PageTitle";
import Loader from "../../components/common/Loader";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Alert from "../../components/ui/Alert";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";
import { Mail } from "lucide-react";
import Tabs from "../../components/ui/Tabs";
import Dropdown from "../../components/ui/Dropdown";
import Avatar from "../../components/ui/Avatar";

function ComponentPlayground() {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Feedback",
    "Analytics",
    "Settings",
  ];

  function handleClick() {
    alert("Button Clicked!");
  }

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "400px",
      }}
    >

      <Card>
        <PageTitle title="Button Playground" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Button
            variant="primary"
            fullWidth
            onClick={handleClick}
          >
            Login
          </Button>

          <Button
            variant="secondary"
            disabled
          >
            Register
          </Button>

          <Button
            variant="outline"
          >
            Cancel
          </Button>

          <Button
            loading
          >
            Loading
          </Button>
        </div>
      </Card>

      <Card>
        <PageTitle title="Loader Playground" />

        <Loader />
      </Card>

      <Card>
        <PageTitle title="Badge Playground" />

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Badge text="Approved" type="success" />
          <Badge text="Pending" type="warning" />
          <Badge text="Rejected" type="danger" />
          <Badge text="Reviewed" type="info" />
        </div>
      </Card>

      <Card>
        <PageTitle title="Spinner Playground" />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Spinner />
        </div>
      </Card>

      <Card>
        <PageTitle title="Alert Playground" />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Alert
            message="Profile updated successfully!"
            type="success"
          />

          <Alert
            message="Invalid email or password."
            type="error"
          />

          <Alert
            message="Please complete all required fields."
            type="warning"
          />

          <Alert
            message="AI feedback has been generated."
            type="info"
          />
        </div>
      </Card>

      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
      >
        Open Modal
      </Button>

      <Modal
        isOpen={isModalOpen}
        title="Delete Feedback"
        confirmText="Delete"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          alert("Feedback deleted successfully!");
          setIsModalOpen(false);
        }}
      >
        <p>
          Are you sure you want to delete this feedback?
          This action cannot be undone.
        </p>
      </Modal>

      <Card>
        <PageTitle title="Toast Playground" />
        <Button
          onClick={() => {
            setShowToast(true);
          }}
        >
          Show Success Toast
        </Button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >

          {showToast && (
            <Toast
              message="Profile updated successfully!"
              type="success"
              duration={3000}
              onClose={() => setShowToast(false)}
            />
          )}
        </div>
      </Card>

      <Card>
        <PageTitle title="Tabs Playground" />

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </Card>

      <Card>
        <PageTitle title="Input Playground" />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <Input
            label="Email Address"
            placeholder="Enter your email"
            leftIcon={<Mail size={18} />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />

          <Input
            label="Username"
            placeholder="Enter username"
            error="Username is required"
          />

          <Input
            label="Disabled"
            placeholder="Disabled input"
            disabled
          />
        </div>
      </Card>

      <Card>
        <PageTitle title="Dropdown Playground" />

        <Dropdown />
      </Card>

      <Card>

        <h2>Avatar Playground</h2>

        <Avatar
          name="Vishal Prajapati"
          size="small"
        />

        <Avatar
          name="John Doe"
          size="medium"
        />

        <Avatar
          name="Alice"
          size="large"
        />

      </Card>
    </div>
  );
}

export default ComponentPlayground; 