import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";

import {
  getVendor,
  updateVendor,
} from "../../services/vendorService";

export default function EditVendor() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    support_portal: "",
  });

  useEffect(() => {
    loadVendor();
  }, []);

  const loadVendor = async () => {
    try {
      const response = await getVendor(id);
      const vendor = response.data.vendor || response.data;
      if (vendor) {
        setFormData({
          company_name: vendor.company_name || "",
          contact_name: vendor.contact_name || "",
          contact_email: vendor.contact_email || "",
          contact_phone: vendor.contact_phone || "",
          support_portal: vendor.support_portal || "",
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
      await updateVendor(id, formData);
      navigate("/vendors");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Edit Vendor">
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
          Update Vendor
        </FormButton>
      </form>
    </PageLayout>
  );
}