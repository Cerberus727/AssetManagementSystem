import { AlertCircle } from "lucide-react";
import Modal from "./Modal";

export default function ErrorModal({
  isOpen,
  onClose,
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Error"
    >
      <div className="text-center">
        <AlertCircle
          size={60}
          className="text-red-500 mx-auto"
        />

        <p className="mt-4 text-slate-600">
          {message}
        </p>

        <button
          onClick={onClose}
          className="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}