import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import { getAsset } from "../../services/assetService";

export default function AssetDetails() {
  const { id } = useParams();

  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAsset();
  }, []);

  const loadAsset = async () => {
    try {
      const response = await getAsset(id);
      setAsset(response.data?.asset || response.data?.data || response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load asset details.");
    }
  };

  if (error) {
    return (
      <PageLayout title="Asset Details">
        <div className="p-4 text-red-500">{error}</div>
      </PageLayout>
    );
  }

  if (!asset) {
    return (
      <PageLayout title="Asset Details">
        <div className="p-4">Loading...</div>
      </PageLayout>
    );
  }

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString();
  };

  return (
    <PageLayout title="Asset Details">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            label="Asset Tag"
            value={asset.asset_tag}
          />

          <InfoCard
            label="Manufacturer"
            value={asset.manufacturer}
          />

          <InfoCard
            label="Model Number"
            value={asset.model_number}
          />
          
          <InfoCard
            label="Serial Number"
            value={asset.serial_number}
          />

          <InfoCard
            label="Category"
            value={asset.category}
          />
          
          <InfoCard
            label="Sub Category"
            value={asset.sub_category}
          />

          <InfoCard
            label="Status"
            value={asset.status}
          />
          
          <InfoCard
            label="Purchase Cost"
            value={asset.purchase_cost ? `$${asset.purchase_cost}` : "-"}
          />

          <InfoCard
            label="Purchase Date"
            value={formatDate(asset.purchase_date)}
          />

          <InfoCard
            label="Warranty Expiry"
            value={formatDate(asset.warranty_expiry)}
          />

          <InfoCard
            label="Assigned To"
            value={asset.employee ? `${asset.employee.first_name} ${asset.employee.last_name}` : "-"}
          />

          <InfoCard
            label="Location"
            value={asset.location ? `${asset.location.building_name} - ${asset.location.room_number}` : "-"}
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