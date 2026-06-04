export default function SearchBar({
  value,
  onChange,
  placeholder,
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        border
        rounded-lg
        px-4
        py-2
        w-full
      "
    />
  );
}