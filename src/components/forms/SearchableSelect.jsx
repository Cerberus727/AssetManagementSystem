import React from "react";
import Select from "react-select";

export default function SearchableSelect({
  label,
  name,
  value,
  onChange,
  options,
  required,
  placeholder,
}) {
  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleChange = (selected) => {
    // Mimic standard event so the parent's onChange works without modification
    onChange({
      target: {
        name,
        value: selected ? selected.value : "",
      },
    });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "0.15rem",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#f97316" : "#e5e7eb", // orange-500 or gray-200
      boxShadow: state.isFocused ? "0 0 0 2px #fbd38d" : "none", // outline ring
      "&:hover": {
        borderColor: state.isFocused ? "#f97316" : "#d1d5db", // gray-300 on hover
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#f97316"
        : state.isFocused
        ? "#fff7ed"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#ea580c",
      },
    }),
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isClearable
        isSearchable
        placeholder={placeholder || `Select ${label.replace(' *', '')}`}
        styles={customStyles}
        required={required && !selectedOption}
      />
    </div>
  );
}
