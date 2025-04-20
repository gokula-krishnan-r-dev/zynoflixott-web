import { useEffect, useState } from "react";

const MultiSelect: React.FC<any> = ({ options, name, field, status }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>(options);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Filter options based on search term

    if (searchTerm) {
      const filtered = options.filter((option: any) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);
  useEffect(() => {
    setSelectedOptions(field.value || []);
  }, [field.value]);

  const handleSelect = (option: any) => {
    // Toggle selection
    if (selectedOptions.find((selected) => selected === option)) {
      setSelectedOptions(
        selectedOptions.filter((selected) => selected !== option)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
      field.onChange([...selectedOptions, option]);
    }
  };

  return (
    <div>
      <input
        onClick={() => setShow(!show)}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setShow(!show);
          setSearchTerm(e.target.value);
        }}
        className="w-full bg-transparent border px-3 py-2 border-gray-700 rounded-lg focus:outline-none focus:ring-indigo-500"
      />
      {show && (
        <ul className="max-h-60 mt-2 overflow-auto border border-gray-700 rounded-lg">
          {filteredOptions?.map((option: any, index: any) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`p-2 cursor-pointer ${
                selectedOptions.find((so: any) => so === option.value)
                  ? "bg-gray-600"
                  : "bg-gray-800"
              }`}
            >
              {selectedOptions.find((so: any) => so.value === option.value)
                ? "checked"
                : ""}{" "}
              {option.label}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3">
        {selectedOptions.length !== 0 && (
          <h3 className="text-sm font-medium">Selected Language:</h3>
        )}
        <ul className="list-disc pl-5">
          {selectedOptions?.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiSelect;
