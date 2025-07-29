export interface TableRowData {
  id: string;
  label: string;
  value: number;
  children?: TableRowData[];
}

export interface InputValues {
  [key: string]: string;
}

export type UpdateType = "percentage" | "direct";
