export default function FormButton({
  children,
  type = "submit",
  loading = false,
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="
        bg-orange-500
        hover:bg-orange-600
        text-white
        px-6
        py-3
        rounded-lg
        font-medium
        transition
      "
    >
      {loading
        ? "Please Wait..."
        : children}
    </button>
  );
}