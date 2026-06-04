export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <select
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
      >
        <option value="">
          Select {label}
        </option>

        {(Array.isArray(options) ? options : []).map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}