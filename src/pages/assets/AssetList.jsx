import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../components/layout/PageLayout";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import {
  getAssets,
  deleteAsset,
} from "../../services/assetService";

import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";

export default function AssetList() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedAsset, setSelectedAsset] =
    useState(null);

  const columns = [
    {
      key: "asset_tag",
      label: "Asset Tag",
    },
    {
      key: "manufacturer",
      label: "Manufacturer",
    },
    {
      key: "po_no",
      label: "PO Number",
    },
    {
      key: "model_number",
      label: "Model",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await getAssets();
      const asts = response.data?.assets || response.data?.data || response.data || [];
      setAssets(Array.isArray(asts) ? asts : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (asset) => {
    navigate(`/assets/${asset.asset_id}`);
  };

  const handleEdit = (asset) => {
    navigate(`/assets/${asset.asset_id}/edit`);
  };

  const handleDeleteClick = (asset) => {
    setSelectedAsset(asset);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAsset(selectedAsset.asset_id);

      loadAssets();

      setDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.asset_tag
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      asset.manufacturer
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <PageLayout title="Assets">
      <div className="bg-white p-6 rounded-xl shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search Assets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              border
              rounded-lg
              px-4
              py-2
              w-80
            "
          />

          <button
            onClick={() =>
              navigate("/assets/new")
            }
            className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            Add Asset
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={filteredAssets}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() =>
          setDeleteModalOpen(false)
        }
        itemName={
          selectedAsset?.asset_tag
        }
        onConfirm={handleDeleteConfirm}
      />
    </PageLayout>
  );
}