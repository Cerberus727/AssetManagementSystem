import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";

import {
  getEmployee,
  updateEmployee,
} from "../../services/employeeService";

export default function EditEmployee() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    role: "",
  });

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const res = await getEmployee(id);
      const emp = res.data.employee || res.data;
      if (emp) {
        setFormData({
          first_name: emp.first_name || "",
          last_name: emp.last_name || "",
          email: emp.email || "",
          department: emp.department || "",
          role: emp.role || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      await updateEmployee(id, formData);
      navigate("/employees");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Edit Employee">
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
          Update Employee
        </FormButton>
      </form>
    </PageLayout>
  );
}