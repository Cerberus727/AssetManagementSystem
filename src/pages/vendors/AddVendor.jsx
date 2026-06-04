import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormTextarea from "../../components/forms/FormTextarea";
import FormButton from "../../components/forms/FormButton";

import { createVendor } from "../../services/vendorService";

export default function AddVendor() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    support_portal: "",
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
      await createVendor(formData);
      navigate("/vendors");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Add Vendor">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <FormInput
          label="Company Name *"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Contact Name *"
          name="contact_name"
          value={formData.contact_name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Contact Email *"
          name="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Contact Phone *"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Support Portal *"
          name="support_portal"
          value={formData.support_portal}
          onChange={handleChange}
          required
        />

        <FormButton loading={loading}>
          Create Vendor
        </FormButton>
      </form>
    </PageLayout>
  );
}