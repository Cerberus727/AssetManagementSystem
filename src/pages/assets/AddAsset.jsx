import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import SearchableSelect from "../../components/forms/SearchableSelect";
import FormButton from "../../components/forms/FormButton";
import { createAsset } from "../../services/assetService";
import { getEmployees } from "../../services/employeeService";
import { getLocations } from "../../services/locationService";
import { getPurchaseOrders, getPurchaseOrder } from "../../services/purchaseOrderService";
import { Lock, Info } from "lucide-react";

export default function AddAsset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);
  const [poLoading, setPoLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    asset_tag: "",
    model_number: "",
    serial_number: "",
    status: "AVAILABLE",
    po_no: "",
    assigned_to: "",
    location_id: "",
  });

  useEffect(() => {
    loadDropdownData();
  }, []);

  const loadDropdownData = async () => {
    try {
      setPageLoading(true);
      const [empRes, locRes, poRes] = await Promise.all([
        getEmployees(),
        getLocations(),
        getPurchaseOrders(),
      ]);
      setEmployees(Array.isArray(empRes.data?.employees) ? empRes.data.employees : []);
      setLocations(Array.isArray(locRes.data?.locations) ? locRes.data.locations : []);
      // Only show POs that have remaining inventory
      const allPos = Array.isArray(poRes.data?.purchaseOrders) ? poRes.data.purchaseOrders : [];
      setPurchaseOrders(allPos.filter((p) => p.available_qty > 0));
    } catch (err) {
      console.error("Failed to load dropdown data", err);
      setError("Failed to load form data");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePOChange = async (e) => {
    const po_no = e.target.value;
    setFormData({ ...formData, po_no });
    if (!po_no) {
      setSelectedPO(null);
      return;
    }
    try {
      setPoLoading(true);
      const res = await getPurchaseOrder(po_no);
      setSelectedPO(res.data?.purchaseOrder || null);
    } catch (err) {
      console.error(err);
      setSelectedPO(null);
    } finally {
      setPoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.po_no) {
      alert("Please select a Purchase Order");
      return;
    }
    try {
      setLoading(true);
      const payload = { ...formData };
      if (!payload.assigned_to) delete payload.assigned_to;
      if (!payload.location_id) delete payload.location_id;
      await createAsset(payload);
      navigate("/assets");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create asset");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-");
  const fmtCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  if (pageLoading) {
    return (
      <PageLayout title="Add Asset">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading form data...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Add Asset">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Add Asset">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Step 1: Select PO */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">1</span>
            Select Purchase Order
          </h2>
          <p className="text-xs text-slate-500 mb-4 ml-8">
            Choose a PO to auto-fill category, manufacturer, cost, and warranty details.
            Only POs with available inventory are shown.
          </p>

          <SearchableSelect
            label="Purchase Order *"
            name="po_no"
            value={formData.po_no}
            onChange={handlePOChange}
            options={purchaseOrders.map((po) => ({
              label: `${po.po_no} — ${po.category} (${po.available_qty} remaining) — ${po.vendor?.company_name || ""}`,
              value: po.po_no,
            }))}
            placeholder="Search by PO number, category, or vendor..."
            required
          />

          {/* PO auto-fill preview */}
          {poLoading && (
            <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400" />
              Loading PO details...
            </div>
          )}

          {selectedPO && !poLoading && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock size={14} className="text-orange-600" />
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                  Auto-filled from PO (read-only — cannot be edited manually)
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {[
                  { label: "Category", value: selectedPO.category },
                  { label: "Sub Category", value: selectedPO.sub_category },
                  { label: "Manufacturer", value: selectedPO.vendor?.company_name },
                  { label: "Purchase Date", value: fmt(selectedPO.capitalized_date) },
                  { label: "Warranty Expiry", value: fmt(selectedPO.warranty_expiry) },
                  { label: "Unit Cost", value: fmtCurrency(selectedPO.unit_cost) },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-md p-2 border border-orange-100">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="font-medium text-slate-700 truncate">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Available inventory: <strong className="text-emerald-600">{selectedPO.available_qty}</strong> of {selectedPO.ordered_qty}
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Asset details */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">2</span>
            Asset Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Asset Tag *"
              name="asset_tag"
              value={formData.asset_tag}
              onChange={handleChange}
              placeholder="e.g. LAP-001"
              required
            />

            <FormInput
              label="Model Number *"
              name="model_number"
              value={formData.model_number}
              onChange={handleChange}
              placeholder="e.g. ThinkPad E14"
              required
            />

            <FormInput
              label="Serial Number *"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="e.g. SN123456"
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

        {/* Step 3: Assignment (optional) */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-400 text-white text-xs flex items-center justify-center font-bold">3</span>
            Assignment
            <span className="text-xs font-normal text-slate-400 ml-1">(optional — creates allocation record if both are provided)</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4 ml-8 flex items-center gap-1">
            <Info size={12} />
            If both Employee and Location are selected, an allocation audit record will be automatically created.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <SearchableSelect
              label="Assigned To (Employee)"
              name="assigned_to"
              value={formData.assigned_to}
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
              value={formData.location_id}
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
          <FormButton loading={loading}>Create Asset</FormButton>
        </div>
      </form>
    </PageLayout>
  );
}