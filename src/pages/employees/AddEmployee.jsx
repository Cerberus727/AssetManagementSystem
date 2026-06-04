import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";

import { createEmployee } from "../../services/employeeService";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createEmployee(formData);
      navigate("/employees");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Add Employee">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <FormInput
          label="First Name *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Last Name *"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Email *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Department *"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        
        <FormInput
          label="Role *"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <FormButton loading={loading}>
          Create Employee
        </FormButton>
      </form>
    </PageLayout>
  );
}