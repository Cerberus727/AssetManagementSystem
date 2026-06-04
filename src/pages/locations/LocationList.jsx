import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getLocations,
  deleteLocation,
} from "../../services/locationService";

export default function LocationList() {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "building_name",
      label: "Building",
    },
    {
      key: "floor",
      label: "Floor",
    },
    {
      key: "room_number",
      label: "Room Number",
    },
    {
      key: "site_manager",
      label: "Site Manager",
    },
  ];

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await getLocations();
      const locs = response.data?.locations || response.data?.location || response.data || [];
      setLocations(Array.isArray(locs) ? locs : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (location) => {
    try {
      await deleteLocation(location.location_id);
      loadLocations();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout title="Locations">
      <div className="mb-4">
        <button
          onClick={() =>
            navigate("/locations/new")
          }
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Add Location
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={locations}
          onView={(location) =>
            navigate(
              `/locations/${location.location_id}`
            )
          }
          onEdit={(location) =>
            navigate(
              `/locations/${location.location_id}/edit`
            )
          }
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}