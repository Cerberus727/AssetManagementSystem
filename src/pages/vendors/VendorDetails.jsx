import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import { getVendor } from "../../services/vendorService";

export default function VendorDetails() {
  const { id } = useParams();

  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVendor();
  }, []);

  const loadVendor = async () => {
    try {
      const response = await getVendor(id);
      setVendor(response.data?.vendor || response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load vendor details.");
    }
  };

  if (error) {
    return (
      <PageLayout title="Vendor Details">
        <div className="p-4 text-red-500">{error}</div>
      </PageLayout>
    );
  }

  if (!vendor) {
    return (
      <PageLayout title="Vendor Details">
        <div className="p-4">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Vendor Details">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard
            label="Company Name"
            value={vendor.company_name}
          />

          <InfoCard
            label="Contact Name"
            value={vendor.contact_name}
          />

          <InfoCard
            label="Contact Email"
            value={vendor.contact_email}
          />

          <InfoCard
            label="Contact Phone"
            value={vendor.contact_phone}
          />

          <InfoCard
            label="Support Portal"
            value={vendor.support_portal}
          />
        </div>
      </div>
    </PageLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <h3 className="font-semibold mt-1">
        {value || "-"}
      </h3>
    </div>
  );
}