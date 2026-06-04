import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import SearchableSelect from "../../components/forms/SearchableSelect";
import FormDate from "../../components/forms/FormDate";
import FormButton from "../../components/forms/FormButton";

import { getAsset, updateAsset } from "../../services/assetService";
import { getEmployees } from "../../services/employeeService";
import { getLocations } from "../../services/locationService";

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    asset_tag: "",
    category: "",
    sub_category: "",
    manufacturer: "",
    model_number: "",
    serial_number: "",
    status: "AVAILABLE",
    po_no: "",
    assigned_to: "",
    location_id: "",
    purchase_date: "",
    warranty_expiry: "",
    purchase_cost: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageLoading(true);
      const [empRes, locRes, assetRes] = await Promise.all([
        getEmployees(),
        getLocations(),
        getAsset(id),
      ]);
      const emps = empRes.data?.employees || empRes.data?.employee || [];
      const locs = locRes.data?.locations || locRes.data?.location || [];
      setEmployees(Array.isArray(emps) ? emps : []);
      setLocations(Array.isArray(locs) ? locs : []);

      const asset = assetRes.data?.asset || assetRes.data?.data || assetRes.data;
      if (asset) {
        setFormData({
          asset_tag: asset.asset_tag || "",
          category: asset.category || "",
          sub_category: asset.sub_category || "",
          manufacturer: asset.manufacturer || "",
          model_number: asset.model_number || "",
          serial_number: asset.serial_number || "",
          status: asset.status || "AVAILABLE",
          po_no: asset.po_no || "",
          assigned_to: asset.assigned_to || "",
          location_id: asset.location_id || "",
          purchase_date: asset.purchase_date ? asset.purchase_date.split("T")[0] : "",
          warranty_expiry: asset.warranty_expiry ? asset.warranty_expiry.split("T")[0] : "",
          purchase_cost: asset.purchase_cost || "",
        });
      }
    } catch (error) {
      console.error("Failed to load data", error);
      setError("Failed to load data");
    } finally {
      setPageLoading(false);
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

      const payload = {
        ...formData,
        purchase_cost: parseFloat(formData.purchase_cost) || 0,
      };

      if (!payload.assigned_to) payload.assigned_to = null;
      if (!payload.location_id) payload.location_id = null;

      await updateAsset(id, payload);

      navigate("/assets");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update asset");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <PageLayout title="Edit Asset"><div className="p-4">Loading...</div></PageLayout>;
  }

  if (error) {
    return <PageLayout title="Edit Asset"><div className="p-4 text-red-500">{error}</div></PageLayout>;
  }

  return (
    <PageLayout title="Edit Asset">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput
            label="Asset Tag *"
            name="asset_tag"
            value={formData.asset_tag}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Category *"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Sub Category"
            name="sub_category"
            value={formData.sub_category}
            onChange={handleChange}
          />

          <FormInput
            label="Manufacturer *"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Model Number *"
            name="model_number"
            value={formData.model_number}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Serial Number *"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            required
          />

          <FormInput
            label="PO Number *"
            name="po_no"
            value={formData.po_no}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Purchase Cost *"
            name="purchase_cost"
            type="number"
            step="0.01"
            value={formData.purchase_cost}
            onChange={handleChange}
            required
          />

          <FormDate
            label="Purchase Date *"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            required
          />

          <FormDate
            label="Warranty Expiry *"
            name="warranty_expiry"
            value={formData.warranty_expiry}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Status *"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { label: "Available", value: "AVAILABLE" },
              { label: "Allocated", value: "ALLOCATED" },
              { label: "Repair", value: "REPAIR" },
              { label: "Retired", value: "RETIRED" },
            ]}
          />

          <SearchableSelect
            label="Assigned To (Employee)"
            name="assigned_to"
            value={formData.assigned_to || ""}
            onChange={handleChange}
            options={(Array.isArray(employees) ? employees : []).map((emp) => ({
              label: `${emp.first_name} ${emp.last_name}`,
              value: emp.employee_id,
            }))}
            placeholder="Search Employee..."
          />

          <FormSelect
            label="Location"
            name="location_id"
            value={formData.location_id || ""}
            onChange={handleChange}
            options={(Array.isArray(locations) ? locations : []).map((loc) => ({
              label: `${loc.building_name} - Floor ${loc.floor} - Room ${loc.room_number}`,
              value: loc.location_id,
            }))}
          />
        </div>

        <FormButton loading={loading}>
          Update Asset
        </FormButton>
      </form>
    </PageLayout>
  );
}