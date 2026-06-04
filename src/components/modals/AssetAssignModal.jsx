import { useState } from "react";
import Modal from "./Modal";
import SearchableSelect from "../forms/SearchableSelect";

export default function AssetAssignModal({
  isOpen,
  onClose,
  employees,
  asset,
  onAssign,
}) {
  const [employeeId, setEmployeeId] = useState("");

  const handleSubmit = () => {
    onAssign(employeeId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Asset"
    >
      <div className="space-y-4">
        <div>
          <label className="block mb-2">
            Asset
          </label>

          <input
            disabled
            value={asset?.assetTag || ""}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <SearchableSelect
            label="Employee"
            name="employee"
            value={employeeId}
            onChange={(e) =>
              setEmployeeId(e.target.value)
            }
            options={(Array.isArray(employees) ? employees : []).map((employee) => ({
              label: employee.name || `${employee.first_name} ${employee.last_name}`,
              value: employee.id || employee.employee_id,
            }))}
            placeholder="Search Employee..."
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg"
        >
          Assign
        </button>
      </div>
    </Modal>
  );
}