export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
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