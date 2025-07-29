import React from "react";
import type { TableRowData, InputValues } from "../types";

interface TableRowProps {
  row: TableRowData;
  level?: number;
  onUpdateValue: (
    id: string,
    newValue: number,
    updateType: "percentage" | "direct"
  ) => void;
  originalData: TableRowData[];
  inputValues: InputValues;
  onInputChange: (id: string, value: string) => void;
}

const calculateVariance = (currentValue: number, originalValue: number) => {
  if (originalValue === 0) return 0;
  return ((currentValue - originalValue) / originalValue) * 100;
};

const roundToTwoDecimals = (num: number) => {
  return Math.round(num * 100) / 100;
};

const TableRow: React.FC<TableRowProps> = ({
  row,
  level = 0,
  onUpdateValue,
  originalData,
  inputValues,
  onInputChange,
}) => {
  const isParent = row.children && row.children.length > 0;
  const indentClass = level > 0 ? "pl-8" : "";
  const prefix = level > 0 ? "-- " : "";

  const findOriginalValue = (
    id: string,
    data: TableRowData[]
  ): number | null => {
    for (const item of data) {
      if (item.id === id) return item.value;
      if (item.children) {
        const found = findOriginalValue(id, item.children);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const originalValue = findOriginalValue(row.id, originalData) ?? 0;
  const variance = calculateVariance(row.value, originalValue);
  const inputValue = inputValues[row.id] || "";

  const handleAllocationPercent = () => {
    const percentValue = parseFloat(inputValue);
    if (isNaN(percentValue)) return;
    const newValue = row.value * (1 + percentValue / 100);
    onUpdateValue(row.id, newValue, "percentage");
  };

  const handleAllocationValue = () => {
    const newValue = parseFloat(inputValue);
    if (isNaN(newValue)) return;
    onUpdateValue(row.id, newValue, "direct");
  };

  return (
    <>
      <tr
        className={`border-b hover:bg-gray-50 ${
          isParent ? "font-semibold bg-gray-100" : ""
        }`}
      >
        <td className={`px-4 py-3 ${indentClass}`}>
          {prefix}
          {row.label}
        </td>
        <td className="px-4 py-3 text-right font-mono">
          {roundToTwoDecimals(row.value)}
        </td>
        <td className="px-4 py-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => onInputChange(row.id, e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </td>
        <td className="px-4 py-3">
          <button
            onClick={handleAllocationPercent}
            disabled={!inputValue}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Allocation %
          </button>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={handleAllocationValue}
            disabled={!inputValue}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Allocation Val
          </button>
        </td>
        <td className="px-4 py-3 text-right font-mono">
          <span
            className={
              variance > 0
                ? "text-green-600"
                : variance < 0
                ? "text-red-600"
                : "text-gray-600"
            }
          >
            {roundToTwoDecimals(variance)}%
          </span>
        </td>
      </tr>
      {isParent &&
        row.children!.map((child) => (
          <TableRow
            key={child.id}
            row={child}
            level={level + 1}
            onUpdateValue={onUpdateValue}
            originalData={originalData}
            inputValues={inputValues}
            onInputChange={onInputChange}
          />
        ))}
    </>
  );
};

export default TableRow;
