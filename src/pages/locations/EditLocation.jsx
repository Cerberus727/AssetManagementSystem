import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";

import {
  getLocation,
  updateLocation,
} from "../../services/locationService";

export default function EditLocation() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    building_name: "",
    floor: "",
    room_number: "",
    site_manager: "",
  });

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const response = await getLocation(id);
      const loc = response.data.location || response.data;
      if (loc) {
        setFormData({
          building_name: loc.building_name || "",
          floor: loc.floor || "",
          room_number: loc.room_number || "",
          site_manager: loc.site_manager || "",
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
      await updateLocation(id, formData);
      navigate("/locations");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Edit Location">
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
          Update Location
        </FormButton>
      </form>
    </PageLayout>
  );
}