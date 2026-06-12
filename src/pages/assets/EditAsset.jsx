import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import SearchableSelect from "../../components/forms/SearchableSelect";
import FormButton from "../../components/forms/FormButton";
import { getAsset, updateAsset } from "../../services/assetService";
import { getEmployees } from "../../services/employeeService";
import { getLocations } from "../../services/locationService";
import { Lock, Info } from "lucide-react";

export default function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [poData, setPoData] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    asset_tag: "",
    model_number: "",
    serial_number: "",
    status: "AVAILABLE",
    assigned_to: "",
    location_id: "",
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
      setEmployees(Array.isArray(empRes.data?.employees) ? empRes.data.employees : []);
      setLocations(Array.isArray(locRes.data?.locations) ? locRes.data.locations : []);

      const asset = assetRes.data?.asset || assetRes.data;
      if (asset) {
        // Store PO-derived fields for display only
        if (asset.purchaseOrder) {
          setPoData(asset.purchaseOrder);
        }
        // Only populate user-editable fields
        setFormData({
          asset_tag: asset.asset_tag || "",
          model_number: asset.model_number || "",
          serial_number: asset.serial_number || "",
          status: asset.status || "AVAILABLE",
          assigned_to: asset.assigned_to || "",
          location_id: asset.location_id || "",
        });
      }
    } catch (err) {
      console.error("Failed to load data", err);
      setError("Failed to load asset data");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData };
      payload.assigned_to = payload.assigned_to || null;
      payload.location_id = payload.location_id || null;
      await updateAsset(id, payload);
      navigate("/assets");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update asset");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-");
  const fmtCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  if (pageLoading) {
    return (
      <PageLayout title="Edit Asset">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Edit Asset">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Edit Asset">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PO-derived fields — read only */}
        {poData && (
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={15} className="text-orange-600" />
              <h2 className="font-semibold text-slate-700">
                PO-Derived Fields
                <span className="text-xs font-normal text-slate-400 ml-2">(auto-populated from PO — cannot be edited)</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                { label: "PO Number", value: poData.po_no },
                { label: "Category", value: poData.category },
                { label: "Sub Category", value: poData.sub_category },
                { label: "Manufacturer (Vendor)", value: poData.vendor?.company_name },
                { label: "Capitalized Date", value: fmt(poData.capitalized_date) },
                { label: "Warranty Expiry", value: fmt(poData.warranty_expiry) },
                { label: "Unit Cost", value: fmtCurrency(poData.unit_cost) },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-md p-2 border border-slate-100">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="font-medium text-slate-600">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editable asset fields */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-700 mb-4">Editable Fields</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Asset Tag *"
              name="asset_tag"
              value={formData.asset_tag}
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
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-700 mb-1">Assignment</h2>
          <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
            <Info size={12} />
            Changing the employee or location will create a new allocation history record.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Assigned To (Employee)"
              name="assigned_to"
              value={formData.assigned_to || ""}
              onChange={handleChange}
              options={employees.map((emp) => ({
                label: `${emp.first_name} ${emp.last_name} — ${emp.department}`,
                value: emp.employee_id,
              }))}
              placeholder="Search employee..."
            />
            <SearchableSelect
              label="Location"
              name="location_id"
              value={formData.location_id || ""}
              onChange={handleChange}
              options={locations.map((loc) => ({
                label: `${loc.building_name} - Floor ${loc.floor} - Room ${loc.room_number}`,
                value: loc.location_id,
              }))}
              placeholder="Search location..."
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <FormButton loading={loading}>Update Asset</FormButton>
        </div>
      </form>
    </PageLayout>
  );
}