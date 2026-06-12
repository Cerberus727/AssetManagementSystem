import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import FormInput from "../../components/forms/FormInput";
import FormDate from "../../components/forms/FormDate";
import FormButton from "../../components/forms/FormButton";
import SearchableSelect from "../../components/forms/SearchableSelect";
import { getPurchaseOrder, updatePurchaseOrder } from "../../services/purchaseOrderService";
import { getVendors } from "../../services/vendorService";

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [assetsCreated, setAssetsCreated] = useState(0);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    capitalized_date: "",
    ordered_qty: "",
    unit_cost: "",
    category: "",
    sub_category: "",
    vendor_id: "",
    warranty_expiry: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageLoading(true);
      const [poRes, vendorRes] = await Promise.all([
        getPurchaseOrder(id),
        getVendors(),
      ]);
      const po = poRes.data?.purchaseOrder;
      const v = vendorRes.data?.vendors || [];
      setVendors(Array.isArray(v) ? v : []);
      if (po) {
        setAssetsCreated(po.assets_created || 0);
        setFormData({
          description: po.description || "",
          capitalized_date: po.capitalized_date ? po.capitalized_date.split("T")[0] : "",
          ordered_qty: po.ordered_qty || "",
          unit_cost: po.unit_cost || "",
          category: po.category || "",
          sub_category: po.sub_category || "",
          vendor_id: po.vendor_id || "",
          warranty_expiry: po.warranty_expiry ? po.warranty_expiry.split("T")[0] : "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load purchase order");
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
      const payload = {
        ...formData,
        ordered_qty: parseInt(formData.ordered_qty),
        unit_cost: parseFloat(formData.unit_cost),
      };
      await updatePurchaseOrder(id, payload);
      navigate("/purchase-orders");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update purchase order");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <PageLayout title="Edit Purchase Order">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Edit Purchase Order">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`Edit PO: ${id}`}>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* PO number is immutable — display only */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Purchase Order Number (immutable)</p>
          <p className="font-mono text-lg font-bold text-orange-600">{id}</p>
          {assetsCreated > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠ {assetsCreated} asset(s) already created from this PO. Ordered quantity cannot be reduced below {assetsCreated}.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <SearchableSelect
            label="Vendor *"
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            options={vendors.map((v) => ({
              label: v.company_name,
              value: v.vendor_id,
            }))}
            placeholder="Search vendor..."
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
            label="Sub Category *"
            name="sub_category"
            value={formData.sub_category}
            onChange={handleChange}
            required
          />

          <FormInput
            label={`Ordered Quantity * (min: ${assetsCreated})`}
            name="ordered_qty"
            type="number"
            min={assetsCreated || 1}
            value={formData.ordered_qty}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Unit Cost (₹) *"
            name="unit_cost"
            type="number"
            min="0"
            step="0.01"
            value={formData.unit_cost}
            onChange={handleChange}
            required
          />

          <FormDate
            label="Capitalized Date *"
            name="capitalized_date"
            value={formData.capitalized_date}
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
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <FormButton loading={loading}>Update Purchase Order</FormButton>
      </form>
    </PageLayout>
  );
}
