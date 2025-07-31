import React, { useState, useCallback, useMemo } from "react";
import TableRow from "./TableRow";
import type { TableRowData, InputValues, UpdateType } from "../types";

const initialData: TableRowData[] = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1500,
    children: [
      { id: "phones", label: "Phones", value: 800 },
      { id: "laptops", label: "Laptops", value: 700 },
    ],
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000,
    children: [
      { id: "tables", label: "Tables", value: 300 },
      { id: "chairs", label: "Chairs", value: 700 },
    ],
  },
];

const calculateSubtotal = (children: TableRowData[]): number => {
  return children.reduce((sum, child) => sum + child.value, 0);
};

const calculateVariance = (currentValue: number, originalValue: number) => {
  if (originalValue === 0) return 0;
  return ((currentValue - originalValue) / originalValue) * 100;
};

const roundToTwoDecimals = (num: number) => {
  return Math.round(num * 100) / 100;
};

const HierarchicalTable: React.FC = () => {
  const [data, setData] = useState<TableRowData[]>(initialData);
  const [originalData] = useState<TableRowData[]>(
    JSON.parse(JSON.stringify(initialData))
  );
  const [inputValues, setInputValues] = useState<InputValues>({});

  // calc grand total
  const grandTotal = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const originalGrandTotal = useMemo(() => {
    return originalData.reduce((sum, item) => sum + item.value, 0);
  }, [originalData]);

  const grandTotalVariance = calculateVariance(grandTotal, originalGrandTotal);

  const handleInputChange = useCallback((id: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

  // find and update item in data structure
  const findAndUpdateItem = useCallback(
    (
      items: TableRowData[],
      id: string,
      newValue: number,
      updateType: UpdateType
    ): TableRowData[] => {
      return items.map((item) => {
        if (item.id === id) {
          if (
            (updateType === "direct" || updateType === "percentage") &&
            item.children &&
            item.children.length > 0
          ) {
            // if we are updating a parent directly or by percent, distribute to children proportionally
            const currentSubtotal = calculateSubtotal(item.children);
            const updatedChildren = item.children.map((child) => ({
              ...child,
              value:
                currentSubtotal > 0
                  ? roundToTwoDecimals(
                      (child.value / currentSubtotal) * newValue
                    )
                  : 0,
            }));
            return {
              ...item,
              value: newValue,
              children: updatedChildren,
            };
          } else {
            return {
              ...item,
              value: roundToTwoDecimals(newValue),
            };
          }
        }

        if (item.children) {
          const updatedChildren = findAndUpdateItem(
            item.children,
            id,
            newValue,
            updateType
          );
          const hasChanges = updatedChildren.some(
            (child, index) => child !== item.children![index]
          );

          if (hasChanges) {
            const newSubtotal = calculateSubtotal(updatedChildren);
            return {
              ...item,
              children: updatedChildren,
              value: roundToTwoDecimals(newSubtotal),
            };
          }
        }

        return item;
      });
    },
    []
  );

  const handleUpdateValue = useCallback(
    (id: string, newValue: number, updateType: UpdateType) => {
      setData((prevData) => {
        const newData = deepClone(prevData);
        return findAndUpdateItem(newData, id, newValue, updateType);
      });
      setInputValues((prev) => ({
        ...prev,
        [id]: "",
      }));
    },
    [findAndUpdateItem]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hierarchical Table Management
        </h1>
        <p className="text-gray-600">
          Manage values with percentage and direct allocation controls
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Label</th>
                <th className="px-4 py-3 text-right font-semibold">Value</th>
                <th className="px-4 py-3 text-center font-semibold">Input</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Allocation %
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Allocation Val
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Variance %
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  onUpdateValue={handleUpdateValue}
                  originalData={originalData}
                  inputValues={inputValues}
                  onInputChange={handleInputChange}
                />
              ))}
              <tr className="bg-yellow-50 border-t-2 border-yellow-400 font-bold">
                <td className="px-4 py-3 text-lg">Grand Total</td>
                <td className="px-4 py-3 text-right text-lg font-mono">
                  {roundToTwoDecimals(grandTotal)}
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-right text-lg font-mono">
                  <span
                    className={
                      grandTotalVariance > 0
                        ? "text-green-600"
                        : grandTotalVariance < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {roundToTwoDecimals(grandTotalVariance)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Allocation %:</strong> Enter a percentage (e.g., 10) to
            increase/decrease the value by that percentage
          </p>
          <p>
            <strong>Allocation Val:</strong> Enter a number to set the value
            directly
          </p>
          <p>
            <strong>Parent Updates:</strong> When updating a parent value
            directly, it distributes proportionally to children
          </p>
          <p>
            <strong>Child Updates:</strong> When updating a child value, parent
            subtotals are automatically recalculated
          </p>
        </div>
      </div>
    </div>
  );
};

export default HierarchicalTable;
