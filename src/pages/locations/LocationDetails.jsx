import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";

import { getLocation } from "../../services/locationService";

export default function LocationDetails() {
  const { id } = useParams();

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const response = await getLocation(id);
      setLocation(response.data?.location || response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load location details.");
    }
  };

  if (error) {
    return (
      <PageLayout title="Location Details">
        <div className="p-4 text-red-500">{error}</div>
      </PageLayout>
    );
  }

  if (!location) {
    return (
      <PageLayout title="Location Details">
        <div className="p-4">Loading...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Location Details">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard
            label="Building Name"
            value={location.building_name}
          />

          <InfoCard
            label="Floor"
            value={location.floor}
          />

          <InfoCard
            label="Room Number"
            value={location.room_number}
          />

          <InfoCard
            label="Site Manager"
            value={location.site_manager}
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