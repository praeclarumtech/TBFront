import React, { useState } from "react";

const PassingYearForm = () => {
  const [year, setYear] = useState("");
  const [years, setYears] = useState([2024, 2025]);

  const handleAddYear = () => {
    if (year && !years.includes(Number(year))) {
      setYears([...years, Number(year)]);
      setYear("");
    }
  };

  const handleCancel = () => {
    setYear("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Add DropDown Items of Passing Year</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium">Passing Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter Year"
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border rounded-md text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleAddYear}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add
        </button>
      </div>
      
      <h3 className="text-lg font-semibold mt-6">Passing Year</h3>
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">S.no</th>
            <th className="border px-4 py-2">Year</th>
          </tr>
        </thead>
        <tbody>
          {years.map((yr, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{yr}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold bg-gray-100">
            <td className="border px-4 py-2 text-right">Totals</td>
            <td className="border px-4 py-2">{years.length}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PassingYearForm;
