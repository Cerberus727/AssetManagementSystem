import { CheckCircle } from "lucide-react";
import Modal from "./Modal";

export default function SuccessModal({
  isOpen,
  onClose,
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Success"
    >
      <div className="text-center">
        <CheckCircle
          size={60}
          className="text-green-500 mx-auto"
        />

        <p className="mt-4 text-slate-600">
          {message}
        </p>

        <button
          onClick={onClose}
          className="mt-6 bg-green-500 text-white px-5 py-2 rounded-lg"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}