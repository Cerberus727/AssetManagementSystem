export default function StatusBadge({
  status,
}) {
  const colors = {
    ACTIVE:
      "bg-green-100 text-green-700",

    AVAILABLE:
      "bg-blue-100 text-blue-700",

    ALLOCATED:
      "bg-orange-100 text-orange-700",

    REPAIR:
      "bg-yellow-100 text-yellow-700",

    RETIRED:
      "bg-red-100 text-red-700",

    OPEN:
      "bg-red-100 text-red-700",

    CLOSED:
      "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${colors[status]}
      `}
    >
      {status}
    </span>
  );
}