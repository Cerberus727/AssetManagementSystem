import { useState } from "react";
import Modal from "./Modal";

export default function TicketStatusModal({
  isOpen,
  onClose,
  ticket,
  onUpdate,
}) {
  const [status, setStatus] = useState(
    ticket?.status || "OPEN"
  );

  const handleSubmit = () => {
    onUpdate(status);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Ticket Status"
    >
      <div className="space-y-4">
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="OPEN">
            Open
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

          <option value="CLOSED">
            Closed
          </option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-5 py-2 rounded-lg"
        >
          Update Status
        </button>
      </div>
    </Modal>
  );
}