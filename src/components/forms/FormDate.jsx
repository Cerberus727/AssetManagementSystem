export default function FormDate({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          border
          rounded-lg
          px-4
          py-3
          focus:ring-2
          focus:ring-orange-500
          outline-none
        "
      />
    </div>
  );
}