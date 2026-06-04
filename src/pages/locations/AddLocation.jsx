import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";

import { createLocation } from "../../services/locationService";

export default function AddLocation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    building_name: "",
    floor: "",
    room_number: "",
    site_manager: "",
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
      await createLocation(formData);
      navigate("/locations");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Add Location">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <FormInput
          label="Building Name *"
          name="building_name"
          value={formData.building_name}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Floor *"
          name="floor"
          value={formData.floor}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Room Number *"
          name="room_number"
          value={formData.room_number}
          onChange={handleChange}
          required
        />

        <FormInput
          label="Site Manager"
          name="site_manager"
          value={formData.site_manager}
          onChange={handleChange}
        />

        <FormButton loading={loading}>
          Create Location
        </FormButton>
      </form>
    </PageLayout>
  );
}