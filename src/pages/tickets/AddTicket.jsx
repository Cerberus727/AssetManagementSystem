import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import SearchableSelect from "../../components/forms/SearchableSelect";
import FormTextarea from "../../components/forms/FormTextarea";
import FormDate from "../../components/forms/FormDate";
import FormButton from "../../components/forms/FormButton";

import { createTicket } from "../../services/ticketService";
import { getAssets } from "../../services/assetService";

export default function AddTicket() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    asset_id: "",
    ticket_type: "",
    issue_description: "",
    opened_date: "",
    resolved_date: "",
    cost: "",
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setPageLoading(true);
      const res = await getAssets();
      const asts = res.data?.assets || res.data?.asset || res.data?.data || [];
      setAssets(Array.isArray(asts) ? asts : []);
    } catch (error) {
      console.error(error);
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
      await createTicket(formData);
      navigate("/tickets");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <PageLayout title="Create Ticket"><div className="p-4">Loading...</div></PageLayout>;
  }

  if (error) {
    return <PageLayout title="Create Ticket"><div className="p-4 text-red-500">{error}</div></PageLayout>;
  }

  return (
    <PageLayout title="Create Ticket">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <SearchableSelect
          label="Asset *"
          name="asset_id"
          value={formData.asset_id}
          onChange={handleChange}
          required
          placeholder="Search Asset..."
          options={(Array.isArray(assets) ? assets : []).map((asset) => ({
            label: `${asset.asset_tag} - ${asset.model_number || asset.model}`,
            value: asset.asset_id,
          }))}
        />

        <FormInput
          label="Ticket Type *"
          name="ticket_type"
          value={formData.ticket_type}
          onChange={handleChange}
          required
        />

        <FormTextarea
          label="Issue Description *"
          name="issue_description"
          value={formData.issue_description}
          onChange={handleChange}
          required
        />

        <FormDate
          label="Opened Date *"
          name="opened_date"
          value={formData.opened_date}
          onChange={handleChange}
          required
        />

        <FormDate
          label="Resolved Date"
          name="resolved_date"
          value={formData.resolved_date}
          onChange={handleChange}
        />

        <FormInput
          label="Cost *"
          name="cost"
          type="number"
          step="0.01"
          value={formData.cost}
          onChange={handleChange}
          required
        />

        <FormButton loading={loading}>
          Create Ticket
        </FormButton>
      </form>
    </PageLayout>
  );
}