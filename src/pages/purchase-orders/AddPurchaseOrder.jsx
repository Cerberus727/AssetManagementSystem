import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/layout/PageLayout";
import FormInput from "../../components/forms/FormInput";
import FormDate from "../../components/forms/FormDate";
import FormButton from "../../components/forms/FormButton";
import SearchableSelect from "../../components/forms/SearchableSelect";
import { createPurchaseOrder } from "../../services/purchaseOrderService";
import { getVendors } from "../../services/vendorService";

export default function AddPurchaseOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    po_no: "",
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
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setPageLoading(true);
      const res = await getVendors();
      const v = res.data?.vendors || [];
      setVendors(Array.isArray(v) ? v : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load vendors");
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
      await createPurchaseOrder(payload);
      navigate("/purchase-orders");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create purchase order");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <PageLayout title="New Purchase Order">
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3" />
          Loading...
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="New Purchase Order">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">{error}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="New Purchase Order">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* Info banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-700">
          <strong>Note:</strong> The PO Number is a manual identifier (e.g., <code>PO-2024-001</code>). It must be unique across all purchase orders.
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormInput
            label="PO Number *"
            name="po_no"
            value={formData.po_no}
            onChange={handleChange}
            placeholder="e.g. PO-2024-001"
            required
          />

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
            placeholder="e.g. Laptop, Server, Printer"
            required
          />

          <FormInput
            label="Sub Category *"
            name="sub_category"
            value={formData.sub_category}
            onChange={handleChange}
            placeholder="e.g. Business Laptop, Rack Server"
            required
          />

          <FormInput
            label="Ordered Quantity *"
            name="ordered_qty"
            type="number"
            min="1"
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
            placeholder="Brief description of this purchase order..."
          />
        </div>

        <FormButton loading={loading}>Create Purchase Order</FormButton>
      </form>
    </PageLayout>
  );
}
