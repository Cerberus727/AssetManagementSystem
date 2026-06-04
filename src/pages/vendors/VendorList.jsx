import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getVendors,
  deleteVendor,
} from "../../services/vendorService";

export default function VendorList() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      key: "company_name",
      label: "Vendor Name",
    },
    {
      key: "contact_name",
      label: "Contact Person",
    },
    {
      key: "contact_email",
      label: "Email",
    },
    {
      key: "contact_phone",
      label: "Phone",
    },
  ];

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await getVendors();
      const vends = response.data?.vendors || response.data?.vendor || response.data || [];
      setVendors(Array.isArray(vends) ? vends : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendor) => {
    try {
      await deleteVendor(vendor.vendor_id);
      loadVendors();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout title="Vendors">
      <div className="mb-4">
        <button
          onClick={() => navigate("/vendors/new")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Add Vendor
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          columns={columns}
          data={vendors}
          onView={(vendor) =>
            navigate(`/vendors/${vendor.vendor_id}`)
          }
          onEdit={(vendor) =>
            navigate(`/vendors/${vendor.vendor_id}/edit`)
          }
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}